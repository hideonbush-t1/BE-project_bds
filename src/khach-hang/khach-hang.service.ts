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
    const existingId = await this.prisma.khachHang.findUnique({ where: { id: data.maKH } });
    if (existingId) throw new ConflictException(`Mã khách hàng ${data.maKH} đã tồn tại!`);

    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({ where: { soCMND: data.soCMND } });
      if (existingCMND) throw new ConflictException("Số CMND/CCCD đã tồn tại!");
    }

    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({ where: { email: data.email } });
      if (existingEmail) throw new ConflictException("Email đã được sử dụng!");
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

  // 4. Cập nhật (Đã sửa lỗi gửi thừa 'maKH')
  async update(id: string, data: UpdateKhachHangDto) {
    // Kiểm tra trùng lặp (loại trừ chính bản thân khách hàng đang cập nhật)
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, NOT: { id } }
      });
      if (existingCMND) throw new ConflictException("Số CMND/CCCD này đã tồn tại!");
    }

    if (data.email) {
      const existingEmail = await this.prisma.khachHang.findFirst({
        where: { email: data.email, NOT: { id } }
      });
      if (existingEmail) throw new ConflictException("Email đã được sử dụng!");
    }

    // Tách dữ liệu cần cập nhật, loại bỏ ID/maKH ra khỏi data
    const { maKH, ...updateFields } = data as any;

    return await this.prisma.khachHang.update({
      where: { id },
      data: {
        ...updateFields,
        ...(data.ngaySinh && { ngaySinh: new Date(data.ngaySinh) }),
      },
    });
  }

  // 5. Xóa
  override async remove(id: string): Promise<any> {
    const bdsCount = await this.prisma.batDongSan.count({
      where: { khachHangId: id, isDeleted: false }
    });

    if (bdsCount > 0) {
      throw new ConflictException("Không thể xóa! Khách hàng này đang sở hữu bất động sản.");
    }

    return await this.prisma.khachHang.delete({
      where: { id },
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