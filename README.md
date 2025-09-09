# Project_ReactNative_PHP

Dự án mẫu kết hợp **React Native (ứng dụng di động)** và **PHP + MySQL (backend API)**.  
Mục tiêu: Xây dựng hệ thống **đăng nhập / đăng ký** đơn giản cho người dùng.

---

## Giới thiệu
- **Frontend**: Ứng dụng React Native quản lý giao diện người dùng và điều hướng giữa các màn hình (Login, Register, Home).  
- **Backend**: API viết bằng PHP, giao tiếp với MySQL để xác thực và quản lý tài khoản.  
- **Database**: Lưu trữ thông tin tài khoản (username, password).  

---

## Chức năng chính
1. **Đăng ký (Register)**  
   - Người dùng tạo tài khoản mới.  
   - Kiểm tra trùng username trong database.  

2. **Đăng nhập (Login)**  
   - Gửi username + password đến API PHP.  
   - Trả về thông tin người dùng nếu hợp lệ.  

3. **Quản lý trạng thái người dùng**  
   - Lưu token hoặc thông tin đăng nhập bằng **AsyncStorage**.  
   - Chuyển hướng sang màn hình **Home** sau khi đăng nhập thành công.  

---

## Cấu trúc thư mục

### Frontend (React Native

    frontend/
    ┣ screens/
    ┃ ┣ LoginScreen.js
    ┃ ┣ RegisterScreen.js
    ┃ ┣ HomeScreen.js
    ┣ api/
    ┃ ┣ auth.js
    ┣ App.js


    backend/
    ┣ config/
    ┃ ┣ connect.php # Kết nối database
    ┣ api/
    ┃ ┣ register.php # Xử lý đăng ký
    ┃ ┣ login.php # Xử lý đăng nhập
    ┗ index.php
