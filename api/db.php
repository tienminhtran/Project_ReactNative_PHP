<?php
// api/db.php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = 'root';
$DB_NAME = 'hehe';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($mysqli->connect_errno) {
  http_response_code(500);
  die(json_encode(["success" => false, "message" => "DB connect error: " . $mysqli->connect_error]));
}
$mysqli->set_charset('utf8mb4');

function cors() {
  header('Content-Type: application/json; charset=UTF-8');
  header('Access-Control-Allow-Origin: *'); // Dev: cho phép tất cả
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); exit;
  }
}
?>
