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

  /**
   * Thêm mới khách hàng với cơ chế chặn trùng lặp
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

    // 2. Kiểm tra trùng số CMND/CCCD
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { soCMND: data.soCMND, isDeleted: false }
      });
      if (existingCMND) {
        throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng bởi khách hàng khác!`);
      }
    }

    // 3. Xử lý logic nhanVienId để tránh lỗi Foreign Key
    const finalNhanVienId = (data.nhanVienId && data.nhanVienId !== 'NV_CHUA_XAC_DINH') 
                            ? data.nhanVienId 
                            : null;

    // 4. Lưu vào DB
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
        nhanVienId: finalNhanVienId,
        isDeleted: false,
        ngayTao: new Date(),
        soCMND: data.soCMND ?? null,
      },
    });
  }

  /**
   * Chỉnh sửa thông tin khách hàng
   */
  async update(id: string, data: UpdateKhachHangDto) {
    // 1. Kiểm tra trùng CMND khi cập nhật
    if (data.soCMND) {
      const existingCMND = await this.prisma.khachHang.findFirst({
        where: { 
          soCMND: data.soCMND, 
          isDeleted: false,
          NOT: { id: id } 
        }
      });
      if (existingCMND) {
        throw new ConflictException(`Số CMND/CCCD ${data.soCMND} đã được sử dụng bởi khách hàng khác!`);
      }
    }

    // Tách dữ liệu
    const { maKH, ...updateFields } = data as any;

    // 2. Thực hiện cập nhật
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
    // 💡 1. KIỂM TRA SỰ TỒN TẠI TRƯỚC KHI XÓA
    const khachHang = await this.prisma.khachHang.findUnique({
      where: { id: id }
    });

    if (!khachHang) {
      throw new NotFoundException(`Không tìm thấy khách hàng có mã: ${id}`);
    }

    // 2. Kiểm tra khóa ngoại
    const bdsCount = await this.prisma.batDongSan.count({
      where: { khachHangId: id, isDeleted: false }
    });

    if (bdsCount > 0) {
      throw new ConflictException("Không thể xóa! Khách hàng này đang sở hữu bất động sản.");
    }

    // 3. Tiến hành xóa an toàn
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