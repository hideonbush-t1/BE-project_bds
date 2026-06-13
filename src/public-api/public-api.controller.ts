import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('public')
export class PublicApiController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('bat-dong-san')
  findProperties() {
    return this.prisma.batDongSan.findMany({
      orderBy: { ngayTao: 'desc' },
      include: {
        chiTiet: true,
        hinhAnhs: true,
        khachHang: true,
      },
    });
  }

  @Get('thong-bao')
  findNotifications() {
    return this.prisma.thongBao.findMany({
      orderBy: { ngayDang: 'desc' },
      include: { nhanVien: true },
    });
  }

  @Get('ho-so-bieu-mau')
  findForms() {
    return this.prisma.thongBao.findMany({
      orderBy: { ngayDang: 'desc' },
      take: 10,
      include: { nhanVien: true },
    });
  }

  @Post('register')
  register(@Body() body: { hoTen: string; email?: string; soDienThoai?: string; diaChi?: string }) {
    return this.prisma.khachHang.create({
      data: {
        id: `KH${Date.now()}`.slice(0, 20),
        loaiKH: 'Khach hang',
        hoTen: body.hoTen,
        email: body.email,
        soDienThoai: body.soDienThoai ?? '',
        diaChi: body.diaChi ?? '',
        gioiTinh: 'Khac',
        ngaySinh: new Date('2000-01-01'),
        nhanVienId: null,
        isDeleted: false,
        ngayTao: new Date(),
        soCMND: null,
      },
    });
  }
}