export interface JwtPayload {
  sub: string;    // ID người dùng
  maNV: string;   // Mã nhân viên
  hoTen: string;  // Họ tên
  Role: string;   // Vai trò ('admin' hoặc 'employee')
}