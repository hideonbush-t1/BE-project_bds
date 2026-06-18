import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // Seed Admin
  await prisma.nhanVien.upsert({
    where: { id: 'admin' },
    update: {
      Role: 'admin', // Cập nhật role nếu đã tồn tại
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
      Role: 'admin', // Sử dụng Role (Viết hoa chữ R)
      tenDangNhap: 'admin',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });

  // Seed Nhân viên
  await prisma.nhanVien.upsert({
    where: { id: 'nv001' },
    update: {
      Role: 'employee', // Cập nhật role nếu đã tồn tại
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
      Role: 'employee', // Sử dụng Role (Viết hoa chữ R)
      tenDangNhap: 'nv001',
      anhDaiDien: null,
      isDeleted: false,
      ngayTao: new Date(),
    },
  });

  console.log('Seed data successfully!');
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