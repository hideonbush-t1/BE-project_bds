import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';

@Injectable()
export class KhachHangService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id'; // Use Prisma model primary key property
  }

  protected get delegate() {
    return this.prisma.khachHang; // Kết nối với model khachHang từ Prisma Client của nhóm
  }

  /**
   * SRS 5.5.1: Xem danh sách khách hàng 
   * Đã cập nhật tìm kiếm theo Mã KH (id), Tên và SĐT
   */
  override async findAll(query?: { loaiKH?: string; search?: string }) {
    return await this.prisma.khachHang.findMany({
      where: {
        isDeleted: false,
        ...(query?.loaiKH ? { loaiKH: query.loaiKH } : {}),
        ...(query?.search
          ? {
              OR: [
                { id: { contains: query.search } },           // Tìm theo Mã KH
                { hoTen: { contains: query.search } },        // Tìm theo Tên
                { soDienThoai: { contains: query.search } },  // Tìm theo SĐT
              ],
            }
          : {}),
      },
      orderBy: {
        ngayTao: 'desc',
      },
    });
  }

  /**
   * SRS 5.5.3: Ghi đè hàm xem chi tiết khách hàng bằng MaKH (Kiểu string)
   */
  override async findOne(MaKH: string): Promise<any> {
    return await this.prisma.khachHang.findUnique({
      where: { id: MaKH },
    });
  }

  /**
   * SRS 5.5.2: Thêm mới khách hàng vào hệ thống
   */
  async create(data: CreateKhachHangDto) {
    // @ts-ignore
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

  /**
   * SRS 5.5.3: Chỉnh sửa thông tin khách hàng hiện tại
   */
  async update(MaKH: string, data: UpdateKhachHangDto) {
    // @ts-ignore
    return await this.prisma.khachHang.update({
      where: { id: MaKH },
      data: {
        ...(data.loaiKH ? { loaiKH: data.loaiKH } : {}),
        ...(data.hoTen ? { hoTen: data.hoTen } : {}),
        ...(data.gioiTinh ? { gioiTinh: data.gioiTinh } : {}),
        ...(data.ngaySinh ? { ngaySinh: new Date(data.ngaySinh) } : {}),
        ...(data.diaChi ? { diaChi: data.diaChi } : {}),
        ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.nhanVienId ? { nhanVienId: data.nhanVienId } : {}),
        ...(data.soCMND ? { soCMND: data.soCMND } : {}),
      },
    });
  }

  /**
   * SRS 5.5.3: Ghi đè hàm xóa khách hàng (Xóa mềm - Đổi IsDeleted thành 1)
   */
  override async remove(MaKH: string): Promise<any> {
    // @ts-ignore
    return await this.prisma.khachHang.update({
      where: { id: MaKH },
      data: { isDeleted: true },
    });
  }

  // =========================================================================
  // CÁC HÀM TRUY VẤN DỮ LIỆU ĐIỀU HƯỚNG TỪ TRANG CHI TIẾT THEO SRS
  // =========================================================================

  async findNhuCauByKhachHang(khachHangId: string) {
    return await this.prisma.nhuCau.findMany({
      where: {
        khachHangId: khachHangId, 
        isDeleted: false,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findBatDongSanByKhachHang(khachHangId: string) {
    return await this.prisma.batDongSan.findMany({
      where: {
        khachHangId: khachHangId, 
        isDeleted: false,
      },
      orderBy: {
        ngayTao: 'desc',
      },
    });
  }
}