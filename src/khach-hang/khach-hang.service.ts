import { Injectable, ConflictException } from '@nestjs/common'; // Thêm ConflictException
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
   * SRS 5.5.2: Thêm mới khách hàng với cơ chế chặn trùng lặp
   * Đã xử lý lỗi Foreign Key Constraint cho nhanVienId
   */
  async create(data: CreateKhachHangDto) {
    // 1. Kiểm tra trùng mã Khách hàng (id)
    const existingKH = await this.prisma.khachHang.findUnique({
      where: { id: data.maKH }
    });
    if (existingKH) {
      throw new ConflictException(`Mã khách hàng ${data.maKH} đã tồn tại!`);
    }

    // 2. Kiểm tra trùng số CMND/CCCD (nếu có nhập)
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, isDeleted: false }
      });
      if (existingCMND) {
        throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng bởi khách hàng khác!`);
      }
    }

    // 3. Xử lý logic nhanVienId để tránh lỗi Foreign Key
    // Nếu nhanVienId là giá trị mặc định hoặc trống, gán là null
    const finalNhanVienId = (data.nhanVienId && data.nhanVienId !== 'NV_CHUA_XAC_DINH') 
                            ? data.nhanVienId 
                            : null;

    // 4. Thực hiện lưu vào DB
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
        nhanVienId: finalNhanVienId, // Sử dụng biến đã xử lý sạch
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
    // 1. Nếu có cập nhật số CMND, cần kiểm tra xem số mới có bị trùng với người khác không
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { 
          soCMND: data.soCMND, 
          isDeleted: false,
          NOT: { id: MaKH } // Loại trừ chính khách hàng đang sửa
        }
      });
      if (existingCMND) {
        throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng bởi khách hàng khác!`);
      }
    }

    // 2. Thực hiện cập nhật
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