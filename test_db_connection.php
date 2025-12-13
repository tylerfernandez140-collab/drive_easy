<?php

$host = 'mysql';
$port = '3306';
$dbname = 'driveeasy';
$user = 'driveeasy_user';
$password = getenv('MYSQL_PASSWORD');

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Successfully connected to MySQL!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}

?>