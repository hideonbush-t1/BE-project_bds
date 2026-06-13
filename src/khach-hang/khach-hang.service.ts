import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';

@Injectable()
export class KhachHangService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.khachHang;
  }

  create(data: CreateKhachHangDto) {
    return this.prisma.khachHang.create({
      data: {
        id: data.maKH,
        loaiKH: data.loaiKH,
        hoTen: data.hoTen,
        gioiTinh: data.gioiTinh ?? 'Khac',
        ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : new Date('2000-01-01'),
        diaChi: data.diaChi ?? '',
        soDienThoai: data.soDienThoai ?? '',
        email: data.email,
        nhanVienId: null,
        isDeleted: false,
        ngayTao: new Date(),
        soCMND: null,
      },
    });
  }

  update(id: string, data: UpdateKhachHangDto) {
    return this.prisma.khachHang.update({
      where: { id },
      data: {
        ...(data.maKH ? { id: data.maKH } : {}),
        ...(data.loaiKH ? { loaiKH: data.loaiKH } : {}),
        ...(data.hoTen ? { hoTen: data.hoTen } : {}),
        ...(data.gioiTinh ? { gioiTinh: data.gioiTinh } : {}),
        ...(data.ngaySinh ? { ngaySinh: new Date(data.ngaySinh) } : {}),
        ...(data.diaChi ? { diaChi: data.diaChi } : {}),
        ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
        ...(data.email ? { email: data.email } : {}),
      },
    });
  }
}