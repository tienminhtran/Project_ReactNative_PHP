//sanpham.js

import { API_BASE } from "./config";

export async function apiFetchProducts() {
    const res = await fetch(`${API_BASE}/product.php`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Lấy sản phẩm thất bại");
    return json.data;
}
