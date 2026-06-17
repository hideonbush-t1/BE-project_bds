import { Injectable } from '@nestjs/common';
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

  async create(data: CreateNhanVienDto) {
    return this.prisma.nhanVien.create({
      data: {
        id: data.maNV,
        hoTen: data.hoTen,
        diaChi: '',
        gioiTinh: 'Khac',
        ngaySinh: new Date('2000-01-01'),
        chucVu: data.chucVu,
        soDienThoai: data.soDienThoai ?? '',
        email: data.email,
        Role: data.role ? 'admin' : 'employee', // SỬA: Chữ R viết hoa và đổi giá trị
        tenDangNhap: data.maNV,
        anhDaiDien: null,
        isDeleted: false,
        ngayTao: new Date(),
        matKhau: await bcrypt.hash(data.matKhau, 10),
      },
    });
  }

  async update(id: string, data: UpdateNhanVienDto) {
    const payload: any = {
      ...(data.maNV ? { id: data.maNV } : {}),
      ...(data.hoTen ? { hoTen: data.hoTen } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
      ...(data.chucVu ? { chucVu: data.chucVu } : {}),
      // SỬA: Chữ R viết hoa và xử lý linh hoạt cả boolean lẫn string
      ...(typeof data.role === 'boolean' ? { Role: data.role ? 'admin' : 'employee' } : {}),
      ...(typeof data.role === 'string' ? { Role: data.role } : {}),
    };
    if (data.matKhau) {
      payload.matKhau = await bcrypt.hash(data.matKhau, 10);
    }
    return this.prisma.nhanVien.update({ where: { id }, data: payload });
  }
}