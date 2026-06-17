import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.nhanVien.upsert({
    where: { id: 'admin' },
    update: {
      matKhau: passwordHash,
      Role: 'admin', // Đã sửa từ '1' thành 'admin'
      tenDangNhap: 'admin'
    },
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
      Role: 'admin', // Đã sửa từ '1' thành 'admin'
      tenDangNhap: 'admin',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });

  await prisma.nhanVien.upsert({
    where: { id: 'nv001' },
    update: {
      matKhau: passwordHash,
      Role: 'employee', // Đã sửa từ '0' thành 'employee'
      tenDangNhap: 'nv001'
    },
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
      Role: 'employee', // Đã sửa từ '0' thành 'employee'
      tenDangNhap: 'nv001',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });
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