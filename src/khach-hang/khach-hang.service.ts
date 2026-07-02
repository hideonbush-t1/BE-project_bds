import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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

  // 1. Danh sách
  override async findAll(query?: { loaiKH?: string; search?: string }) {
    return await this.prisma.khachHang.findMany({
      where: {
        isDeleted: false,
        ...(query?.loaiKH ? { loaiKH: query.loaiKH } : {}),
        ...(query?.search
          ? {
              OR: [
                { id: { contains: query.search } },
                { hoTen: { contains: query.search } },
                { soDienThoai: { contains: query.search } },
              ],
            }
          : {}),
      },
      orderBy: { ngayTao: 'desc' },
    });
  }

  // 2. Chi tiết
  override async findOne(id: string): Promise<any> {
    const khachHang = await this.prisma.khachHang.findUnique({
      where: { id },
    });
    if (!khachHang) throw new NotFoundException(`Khách hàng ${id} không tồn tại`);
    return khachHang;
  }

  // 3. Thêm mới
  async create(data: CreateKhachHangDto) {
    // Sinh mã KH
    const lastCustomer = await this.prisma.khachHang.findMany({
      orderBy: { id: 'desc' },
      take: 1
    });

    let newId = 'KH001';
    if (lastCustomer.length > 0) {
      const lastId = lastCustomer[0].id;
      const currentNum = parseInt(lastId.replace('KH', ''));
      newId = `KH${(currentNum + 1).toString().padStart(3, '0')}`;
    }

    // Kiểm tra trùng CMND
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, isDeleted: false }
      });
      if (existingCMND) throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng!`);
    }

    // Kiểm tra trùng Email
    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({
        where: { email: data.email, isDeleted: false }
      });
      if (existingEmail) throw new ConflictException(`Email ${data.email} đã được sử dụng!`);
    }

    return await this.prisma.khachHang.create({
      data: {
        id: newId,
        loaiKH: data.loaiKH,
        hoTen: data.hoTen,
        gioiTinh: data.gioiTinh ?? 'Khác',
        ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : new Date('2000-01-01'),
        diaChi: data.diaChi ?? '',
        soDienThoai: data.soDienThoai ?? '',
        email: data.email ?? null,
        nhanVienId: (data.nhanVienId && data.nhanVienId !== 'NV_CHUA_XAC_DINH') ? data.nhanVienId : null,
        isDeleted: false,
        ngayTao: new Date(),
        soCMND: data.soCMND ?? null,
      },
    });
  }

  // 4. Cập nhật
  async update(id: string, data: UpdateKhachHangDto) {
    // Kiểm tra trùng CMND (bỏ qua bản ghi hiện tại)
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, isDeleted: false, NOT: { id: id } }
      });
      if (existingCMND) throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng!`);
    }

    // Kiểm tra trùng Email (bỏ qua bản ghi hiện tại)
    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({
        where: { email: data.email, isDeleted: false, NOT: { id: id } }
      });
      if (existingEmail) throw new ConflictException(`Email ${data.email} đã được sử dụng!`);
    }

    return await this.prisma.khachHang.update({
      where: { id },
      data: {
        ...data,
        ...(data.ngaySinh && { ngaySinh: new Date(data.ngaySinh) }),
      },
    });
  }

  override async remove(id: string): Promise<any> {
    const bdsCount = await this.prisma.batDongSan.count({
      where: { khachHangId: id, isDeleted: false }
    });
    if (bdsCount > 0) {
      throw new ConflictException("Không thể xóa! Khách hàng này đang sở hữu bất động sản.");
    }
    return await this.prisma.khachHang.delete({ where: { id } });
  }

  async findNhuCauByKhachHang(khachHangId: string) {
    return await this.prisma.nhuCau.findMany({ where: { khachHangId, isDeleted: false } });
  }

  async findBatDongSanByKhachHang(khachHangId: string) {
    return await this.prisma.batDongSan.findMany({ where: { khachHangId, isDeleted: false } });
  }
}