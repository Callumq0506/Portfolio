<?php
// Start session for login management
session_start();

// IP-based authentication
$allowed_ip = "82.12.137.49"; // Replace with your actual IP address
$current_ip = $_SERVER['REMOTE_ADDR'];

// Check if user is logged in or has the allowed IP
$authenticated = false;

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $authenticated = true;
} elseif ($current_ip === $allowed_ip) {
    // Auto-login for your IP address
    $_SESSION['admin_logged_in'] = true;
    $authenticated = true;
}

// Handle login attempt
if (isset($_POST['password'])) {
    $admin_password = "your_secure_password"; // Change this to a strong password
    
    if (password_verify($_POST['password'], password_hash($admin_password, PASSWORD_DEFAULT))) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: index.php");
        exit();
    } else {
        $error_message = "Invalid password";
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}

// Database connection function
function connectDB() {
    $db_host = "localhost";
    $db_user = "root"; // Change to your database username
    $db_pass = "";     // Change to your database password
    $db_name = "portfolio_visitors";
    
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Function to get visitor logs
function getVisitorLogs($limit = 100) {
    $conn = connectDB();
    
    $sql = "SELECT * FROM visitors ORDER BY visit_time DESC LIMIT $limit";
    $result = $conn->query($sql);
    
    $logs = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $logs[] = $row;
        }
    }
    
    $conn->close();
    return $logs;
}

// Get visitor statistics
function getVisitorStats() {
    $conn = connectDB();
    
    // Total visits
    $sql_total = "SELECT COUNT(*) as total FROM visitors";
    $result_total = $conn->query($sql_total);
    $total = $result_total ? $result_total->fetch_assoc()['total'] : 0;
    
    // Unique visitors
    $sql_unique = "SELECT COUNT(DISTINCT ip_address) as unique_visitors FROM visitors";
    $result_unique = $conn->query($sql_unique);
    $unique = $result_unique ? $result_unique->fetch_assoc()['unique_visitors'] : 0;
    
    // Today's visits
    $sql_today = "SELECT COUNT(*) as today FROM visitors WHERE DATE(visit_time) = CURDATE()";
    $result_today = $conn->query($sql_today);
    $today = $result_today ? $result_today->fetch_assoc()['today'] : 0;
    
    $conn->close();
    
    return [
        'total' => $total,
        'unique' => $unique,
        'today' => $today
    ];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin.css">
    <meta name="robots" content="noindex, nofollow">
</head>
<body>
    <?php if (!$authenticated): ?>
    <div class="login-container">
        <div class="login-box">
            <h2>Admin Login</h2>
            <?php if (isset($error_message)): ?>
                <div class="error-message"><?php echo $error_message; ?></div>
            <?php endif; ?>
            <?php if ($current_ip !== $allowed_ip): ?>
                <div class="notice-message">
                    <p><strong>Access Restricted</strong></p>
                    <p>This page can only be accessed from the authorized IP address.</p>
                    <p>Current IP: <?php echo $current_ip; ?></p>
                    <p>To access this page:</p>
                    <ol>
                        <li>Edit <code>admin/index.php</code> and <code>admin/.htaccess</code></li>
                        <li>Replace "82.12.137.49" with your actual IP address</li>
                        <li>Set a secure password in the admin/index.php file</li>
                        <li>Run setup_db.php first to create the database</li>
                    </ol>
                </div>
            <?php else: ?>
            <form method="post" action="">
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="login-btn">Login</button>
            </form>
            <?php endif; ?>
        </div>
    </div>
    <?php else: ?>
    <div class="admin-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>Dashboard</h2>
            </div>
            <ul class="sidebar-menu">
                <li class="active"><a href="#"><i class="fas fa-chart-line"></i> Overview</a></li>
                <li><a href="#visitor-logs"><i class="fas fa-users"></i> Visitor Logs</a></li>
                <li><a href="?logout=1"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
            <div class="sidebar-footer">
                <p>Logged in from: <?php echo $current_ip; ?></p>
            </div>
        </div>
        
        <div class="content">
            <div class="header">
                <h1>Admin Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, Admin</span>
                </div>
            </div>
            
            <div class="dashboard">
                <?php $stats = getVisitorStats(); ?>
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value"><?php echo $stats['total']; ?></div>
                        <div class="stat-label">Total Visits</div>
                        <div class="stat-icon"><i class="fas fa-chart-bar"></i></div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-value"><?php echo $stats['unique']; ?></div>
                        <div class="stat-label">Unique Visitors</div>
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-value"><?php echo $stats['today']; ?></div>
                        <div class="stat-label">Today's Visits</div>
                        <div class="stat-icon"><i class="fas fa-calendar-day"></i></div>
                    </div>
                </div>
                
                <div class="section" id="visitor-logs">
                    <div class="section-header">
                        <h2>Recent Visitors</h2>
                        <div class="actions">
                            <button class="refresh-btn" onclick="window.location.reload();">
                                <i class="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>IP Address</th>
                                    <th>User Agent</th>
                                    <th>Page Visited</th>
                                    <th>Referrer</th>
                                    <th>Date/Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                $logs = getVisitorLogs();
                                foreach($logs as $log): 
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($log['ip_address']); ?></td>
                                    <td class="user-agent"><?php echo htmlspecialchars($log['user_agent']); ?></td>
                                    <td><?php echo htmlspecialchars($log['page_visited']); ?></td>
                                    <td><?php echo htmlspecialchars($log['referrer'] ? $log['referrer'] : 'Direct'); ?></td>
                                    <td><?php echo htmlspecialchars($log['visit_time']); ?></td>
                                </tr>
                                <?php endforeach; ?>
                                
                                <?php if (count($logs) === 0): ?>
                                <tr>
                                    <td colspan="5" class="no-data">No visitor logs found</td>
                                </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>
</body>
</html>
