import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto';
import { UpdateNhanVienDto } from './dto/update-nhan-vien.dto';

@Injectable()
export class NhanVienService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.nhanVien;
  }

  // ===============================================
  // 1. LẤY DANH SÁCH (Đã thêm lọc isDeleted: false)
  // ===============================================
  async findAll(search?: string) {
    const safeSelect = { 
      id: true, 
      hoTen: true, 
      email: true, 
      soDienThoai: true, 
      chucVu: true, 
      Role: true, 
      tenDangNhap: true,
      isDeleted: true,
      ngayTao: true
    };

    // Nếu không có tìm kiếm
    if (!search) {
      return this.prisma.nhanVien.findMany({
        where: { isDeleted: false }, // 💡 BẮT BUỘC: Chỉ lấy NV chưa bị xóa
        orderBy: { ngayTao: 'desc' },
        select: safeSelect,
      });
    }

    // Nếu có tìm kiếm
    return this.prisma.nhanVien.findMany({
      where: {
        isDeleted: false, // 💡 BẮT BUỘC: Chỉ tìm trong những NV chưa bị xóa
        OR: [
          { id: { contains: search } },
          { hoTen: { contains: search } },
          { soDienThoai: { contains: search } },
          { email: { contains: search } }
        ],
      },
      orderBy: { ngayTao: 'desc' },
      select: safeSelect,
    });
  }

  async create(data: CreateNhanVienDto) {
    const existingNV = await this.prisma.nhanVien.findUnique({
      where: { id: data.maNV }
    });
    if (existingNV) {
      throw new BadRequestException('Mã nhân viên này đã tồn tại, vui lòng nhập mã khác!');
    }

    const result = await this.prisma.nhanVien.create({
      data: {
        id: data.maNV,
        hoTen: data.hoTen,
        diaChi: '',
        gioiTinh: 'Khac',
        ngaySinh: new Date('2000-01-01'),
        chucVu: data.chucVu,
        soDienThoai: data.soDienThoai ?? '',
        email: data.email,
        Role: data.Role === 'admin' ? 'admin' : 'employee', 
        tenDangNhap: data.maNV,
        anhDaiDien: null,
        isDeleted: false,
        ngayTao: new Date(),
        matKhau: await bcrypt.hash(data.matKhau, 10),
      },
    });

    const { matKhau, ...safeResult } = result;
    return safeResult;
  }

  async update(id: string, data: UpdateNhanVienDto) {
    const payload: any = {
      ...(data.maNV ? { id: data.maNV } : {}),
      ...(data.hoTen ? { hoTen: data.hoTen } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
      ...(data.chucVu ? { chucVu: data.chucVu } : {}),
      ...(data.Role ? { Role: data.Role === 'admin' ? 'admin' : 'employee' } : {}),
    };

    if (data.matKhau) {
      payload.matKhau = await bcrypt.hash(data.matKhau, 10);
    }
    
    const result = await this.prisma.nhanVien.update({ 
      where: { id }, 
      data: payload 
    });

    const { matKhau, ...safeResult } = result;
    return safeResult;
  }

  // ===============================================
  // 2. GHI ĐÈ HÀM XÓA: CHUYỂN SANG XÓA MỀM
  // ===============================================
  async remove(id: string) {
    // Không dùng .delete() để tránh lỗi khóa ngoại (Foreign key) với Khách hàng / BĐS
    // Cập nhật trạng thái isDeleted = true
    return this.prisma.nhanVien.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}