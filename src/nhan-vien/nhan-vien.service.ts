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

    if (!search) {
      return this.prisma.nhanVien.findMany({
        where: { isDeleted: false }, 
        orderBy: { ngayTao: 'desc' },
        select: safeSelect,
      });
    }

    return this.prisma.nhanVien.findMany({
      where: {
        isDeleted: false, 
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

  // ===============================================
  // 2. THÊM MỚI (Tự động sinh mã để không bị trùng)
  // ===============================================
  async create(data: CreateNhanVienDto) {
    // 💡 Backend tự động tìm mã NV lớn nhất hiện tại
    const lastNV = await this.prisma.nhanVien.findFirst({
      orderBy: { id: 'desc' }, 
    });

    let newId = 'NV001';
    if (lastNV && lastNV.id) {
      const lastNumber = parseInt(lastNV.id.replace('NV', ''), 10);
      if (!isNaN(lastNumber)) {
        newId = `NV${(lastNumber + 1).toString().padStart(3, '0')}`;
      }
    }

    // 💡 Lưu DB với mã newId vừa được tự động sinh ra
    const result = await this.prisma.nhanVien.create({
      data: {
        id: newId, 
        hoTen: data.hoTen,
        diaChi: '',
        gioiTinh: 'Khac',
        ngaySinh: new Date('2000-01-01'),
        chucVu: data.chucVu,
        soDienThoai: data.soDienThoai ?? '',
        email: data.email,
        Role: data.Role === 'admin' ? 'admin' : 'employee', 
        tenDangNhap: newId, // Đổi tên đăng nhập thành mã mới luôn
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
  // 3. XÓA CỨNG (XÓA BỐC HƠI KHỎI DATABASE)
  // ===============================================
  async remove(id: string) {
    // 💡 Đổi thành .delete() để xóa sạch sẽ khỏi DB
    return this.prisma.nhanVien.delete({
      where: { id },
    });
  }
}