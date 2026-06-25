import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // Tạo tài khoản Admin
  await prisma.nhanVien.upsert({
    where: { id: 'admin' },
    update: {},
    create: {
      id: 'admin',
      hoTen: 'Quản trị hệ thống',
      diaChi: 'Hà Nội',
      gioiTinh: 'Nam',
      ngaySinh: new Date('1990-01-01'),
      chucVu: 'Admin',
      soDienThoai: '0900000000',
      email: 'admin@bds.local',
      matKhau: passwordHash,
      role: 'admin', // Đã sửa từ Role thành role
      tenDangNhap: 'admin',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });

  // Tạo tài khoản Nhân viên
  await prisma.nhanVien.upsert({
    where: { id: 'nv001' },
    update: {},
    create: {
      id: 'nv001',
      hoTen: 'Nhân viên kinh doanh 001',
      diaChi: 'Đà Nẵng',
      gioiTinh: 'Nam',
      ngaySinh: new Date('1995-05-05'),
      chucVu: 'Nhân viên',
      soDienThoai: '0911111111',
      email: 'nv001@bds.local',
      matKhau: passwordHash,
      role: 'employee', // Đã sửa từ Role thành role
      tenDangNhap: 'nv001',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });

  console.log('Seed data đã được chạy thành công!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });