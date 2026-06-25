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

  // SRS 5.5.1: Xem danh sách
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

  // SRS 5.5.3: Xem chi tiết
  override async findOne(MaKH: string): Promise<any> {
    const khachHang = await this.prisma.khachHang.findUnique({
      where: { id: MaKH },
    });
    if (!khachHang) throw new NotFoundException(`Khách hàng ${MaKH} không tồn tại`);
    return khachHang;
  }

  // SRS 5.5.2: Thêm mới (Có kiểm tra trùng lặp)
  async create(data: CreateKhachHangDto) {
    // 1. Kiểm tra trùng ID
    const existingId = await this.prisma.khachHang.findUnique({ where: { id: data.maKH } });
    if (existingId) throw new ConflictException(`Mã khách hàng ${data.maKH} đã tồn tại!`);

    // 2. Kiểm tra trùng CMND/CCCD
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({ where: { soCMND: data.soCMND } });
      if (existingCMND) throw new ConflictException("Số CMND/CCCD này đã tồn tại trong hệ thống!");
    }

    // 3. Kiểm tra trùng Email
    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({ where: { email: data.email } });
      if (existingEmail) throw new ConflictException("Email này đã được sử dụng!");
    }

    return await this.prisma.khachHang.create({
      data: {
        id: data.maKH,
        loaiKH: data.loaiKH,
        hoTen: data.hoTen,
        gioiTinh: data.gioiTinh ?? 'Khác',
        ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : new Date('2000-01-01'),
        diaChi: data.diaChi ?? '',
        soDienThoai: data.soDienThoai ?? '',
        email: data.email ?? null,
        nhanVienId: data.nhanVienId ?? null,
        isDeleted: false,
        ngayTao: new Date(),
        soCMND: data.soCMND ?? null,
      },
    });
  }

  // SRS 5.5.3: Cập nhật
  async update(MaKH: string, data: UpdateKhachHangDto) {
    // 1. Kiểm tra trùng CMND mới
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, NOT: { id: MaKH } }
      });
      if (existingCMND) throw new ConflictException("Số CMND/CCCD này đã tồn tại!");
    }

    // 2. Kiểm tra trùng Email mới
    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({
        where: { email: data.email, NOT: { id: MaKH } }
      });
      if (existingEmail) throw new ConflictException("Email này đã được sử dụng bởi người khác!");
    }

    return await this.prisma.khachHang.update({
      where: { id: MaKH },
      data: {
        ...data,
        ...(data.ngaySinh && { ngaySinh: new Date(data.ngaySinh) }),
      },
    });
  }

  // Xóa vĩnh viễn (Hard Delete) có kiểm tra ràng buộc
  override async remove(MaKH: string): Promise<any> {
    const bdsCount = await this.prisma.batDongSan.count({
      where: { khachHangId: MaKH, isDeleted: false }
    });

    if (bdsCount > 0) {
      throw new ConflictException("Không thể xóa! Khách hàng này đang sở hữu bất động sản.");
    }

    return await this.prisma.khachHang.delete({
      where: { id: MaKH },
    });
  }

  async findNhuCauByKhachHang(khachHangId: string) {
    return await this.prisma.nhuCau.findMany({
      where: { khachHangId, isDeleted: false },
    });
  }

  async findBatDongSanByKhachHang(khachHangId: string) {
    return await this.prisma.batDongSan.findMany({
      where: { khachHangId, isDeleted: false },
    });
  }
}