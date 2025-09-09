<?php
require_once __DIR__ . '/db.php'; 
header('Content-Type: application/json; charset=UTF-8');

// Hàm trả về JSON
function response($ok, $msg, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        "success" => $ok,
        "message" => $msg,
        "data"    => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "SELECT id, ten, gia, hinh FROM sanpham";
    $result = $mysqli->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            "id"   => (int)$row['id'],
            "ten"  => $row['ten'],
            "gia"  => (float)$row['gia'],
            "hinh" => $row['hinh']
        ];
    }

    response(true, "Lấy danh sách sản phẩm thành công", $products);

} catch (Exception $e) {
    response(false, "Lỗi: " . $e->getMessage(), null, 500);
}
