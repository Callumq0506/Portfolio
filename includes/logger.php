<?php
// Visitor logging functionality

function logVisitor() {
    // Don't log requests for assets
    $requested_uri = $_SERVER['REQUEST_URI'];
    $skip_extensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    
    foreach ($skip_extensions as $ext) {
        if (strpos($requested_uri, $ext) !== false) {
            return;
        }
    }
    
    // Database connection
    $db_host = "localhost";
    $db_user = "root"; // Change to your database username
    $db_pass = "";     // Change to your database password
    $db_name = "portfolio_visitors";
    
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    // Check connection
    if ($conn->connect_error) {
        // Silently fail - don't break the website if logging fails
        return;
    }
    
    // Prepare visitor data
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $page_visited = $_SERVER['REQUEST_URI'];
    $referrer = $_SERVER['HTTP_REFERER'] ?? null;
    
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO visitors (ip_address, user_agent, page_visited, referrer) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $ip_address, $user_agent, $page_visited, $referrer);
    
    // Execute query
    $stmt->execute();
    
    // Close connection
    $stmt->close();
    $conn->close();
}

// Log the visit
logVisitor();
?>
