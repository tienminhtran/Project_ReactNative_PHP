<?php
require_once __DIR__ . '/db.php';
cors();
header('Content-Type: application/json; charset=UTF-8');

function response($success, $message, $data = null, $status = 200) {
  http_response_code($status);
  echo json_encode([
    "success" => $success,
    "message" => $message,
    "data"    => $data
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

$input    = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
$ho_ten   = trim($input['ho_ten'] ?? '');
$email    = trim($input['email'] ?? '');
$sdt      = trim($input['so_dien_thoai'] ?? '');

// Validate
// if ($username === '' || $password === '' || $ho_ten === '' || $email === '') {
//   response(success: false, "Thiếu dữ liệu bắt buộc", null, 400);
// }
if (!preg_match('/^[a-zA-Z0-9_\.]{3,50}$/', $username)) {
  response(false, "Username không hợp lệ", null, 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  response(false, "Email không hợp lệ", null, 422);
}
if (strlen($password) < 6) {
  response(false, "Mật khẩu tối thiểu 6 ký tự", null, 422);
}

$mysqli->begin_transaction();
try {
  //  Check username trùng
  $q1 = $mysqli->prepare("SELECT 1 FROM taikhoan WHERE username=?");
  $q1->bind_param('s', $username);
  $q1->execute();
  if ($q1->get_result()->num_rows > 0) {
    throw new Exception("Username đã tồn tại");
  }

  //  Check email trùng
  $q2 = $mysqli->prepare("SELECT 1 FROM nguoidung WHERE email=?");
  $q2->bind_param('s', $email);
  $q2->execute();
  if ($q2->get_result()->num_rows > 0) {
    throw new Exception("Email đã tồn tại");
  }

  //  Tạo bảng nguoidung
  $insUser = $mysqli->prepare("INSERT INTO nguoidung (ho_ten, email, so_dien_thoai) VALUES (?,?,?)");
  $insUser->bind_param('sss', $ho_ten, $email, $sdt);
  if (!$insUser->execute()) throw new Exception($insUser->error);
  $nguoidung_id = $mysqli->insert_id;

  //  Hash password (bcrypt, an toàn)
  $hash = password_hash($password, PASSWORD_BCRYPT);



  //  Tạo tài khoản
  $role = 'khach';
  $insAcc = $mysqli->prepare("INSERT INTO taikhoan (nguoidung_id, username, password_hash, role) VALUES (?,?,?,?)");
  $insAcc->bind_param('isss', $nguoidung_id, $username, $hash, $role);
  if (!$insAcc->execute()) throw new Exception($insAcc->error);

  $mysqli->commit();
  response(true, "Đăng ký thành công", [
    "id"           => $insAcc->insert_id,
    "username"     => $username,
    "role"         => $role,
    "nguoidung_id" => $nguoidung_id
  ]);
} catch (Exception $e) {
  $mysqli->rollback();
  response(false, $e->getMessage(), null, 409);
}

/* 🔹 Nếu muốn dùng MD5 cho dự án cũ:
   $hash = md5($password);
   Login: if (md5($password_input) === $row['password_hash']) ...
*/
