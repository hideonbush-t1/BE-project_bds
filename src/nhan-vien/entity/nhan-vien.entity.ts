export class NhanVienEntity {
  id!: number;
  maNV!: string;
  hoTen!: string;
  email!: string;
  soDienThoai?: string | null;
  chucVu!: string;
  isAdmin!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}