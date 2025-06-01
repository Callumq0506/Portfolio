<?php
// Database setup script
// Run this script once to create the necessary database and tables

// Database connection details
$db_host = "localhost";
$db_user = "root"; // Change to your database username
$db_pass = "";     // Change to your database password
$db_name = "portfolio_visitors";

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Connect to the created database
$conn->select_db($db_name);

// Create visitors table
$sql = "CREATE TABLE IF NOT EXISTS visitors (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    page_visited VARCHAR(255) NOT NULL,
    referrer VARCHAR(255),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table 'visitors' created successfully or already exists<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

// Close connection
$conn->close();

echo "<br>Setup completed! <a href='index.php'>Go to admin panel</a>";
?>
