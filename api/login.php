<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=UTF-8');

// Hàm trả JSON
function response($ok, $msg, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        "success" => $ok,
        "message" => $msg,
        "data"    => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$input    = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Kiểm tra dữ liệu
if (!$username || !$password) {
    response(false, "Thiếu username hoặc password", null, 400);
}

// Lấy tài khoản
$stmt = $mysqli->prepare("SELECT id, nguoidung_id, password_hash, role FROM taikhoan WHERE username=?");
$stmt->bind_param('s', $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && password_verify($password, $user['password_hash'])) {
    // Cập nhật thời gian đăng nhập
    $upd = $mysqli->prepare("UPDATE taikhoan SET last_login=NOW() WHERE id=?");
    $upd->bind_param('i', $user['id']);
    $upd->execute();

    response(true, "Đăng nhập thành công 1", [
        "id"           => (int)$user['id'],
        "username"     => $username,
        "role"         => $user['role'],
        "nguoidung_id" => (int)$user['nguoidung_id']
    ]);
}

response(false, "Sai tài khoản hoặc mật khẩu", null, 401);
