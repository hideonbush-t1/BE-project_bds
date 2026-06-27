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

  // 💡 BỔ SUNG: Ghi đè hàm findAll để hỗ trợ thanh tìm kiếm từ Frontend
  async findAll(search?: string) {
    // Chỉ định các trường an toàn được phép trả về (Tuyệt đối không có matKhau)
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

    // Nếu không có từ khóa tìm kiếm -> Lấy tất cả nhưng chỉ lấy các trường an toàn
    if (!search) {
      return this.prisma.nhanVien.findMany({
        orderBy: { ngayTao: 'desc' },
        select: safeSelect,
      });
    }

    // Nếu có tìm kiếm
    return this.prisma.nhanVien.findMany({
      where: {
        OR: [
          { id: { contains: search } }, // id chính là maNV
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
    // 💡 BỔ SUNG: Kiểm tra xem mã NV đã tồn tại chưa để tránh lỗi 500 sập server
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

    // 💡 BẢO MẬT: Loại bỏ mật khẩu trước khi trả về cho Frontend
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

    // 💡 BẢO MẬT: Loại bỏ mật khẩu trước khi trả về
    const { matKhau, ...safeResult } = result;
    return safeResult;
  }
}