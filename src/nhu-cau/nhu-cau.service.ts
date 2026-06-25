import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';

@Injectable()
export class NhuCauService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Tìm kiếm với điều kiện lọc (sử dụng tên thuộc tính trong code)
  async findManyWithFilters(query: { q?: string }) {
    const whereCondition: any = { isDeleted: false }; 

    if (query.q && query.q.trim() !== '') {
      const keyword = query.q.trim();
      whereCondition.OR = [
        { khachHangId: { contains: keyword } },
        { loaiBDS: { contains: keyword } },
        { viTri: { contains: keyword } },
      ];
    }

    return await this.prisma.nhuCau.findMany({
      where: whereCondition,
      orderBy: { id: 'desc' }, // 'id' ở đây đã được map với 'MaNC'
    });
  }

  // 2. Lấy tất cả (loại bỏ các bản ghi đã xóa)
  async findAll() {
    return await this.prisma.nhuCau.findMany({
      where: { isDeleted: false },
      orderBy: { id: 'desc' },
    });
  }

  // 3. Tìm theo mã khách hàng
  async findByKhachHang(khachHangId: string) {
    return await this.prisma.nhuCau.findMany({
      where: { khachHangId, isDeleted: false },
      orderBy: { id: 'desc' },
    });
  }

  // 4. Tìm một bản ghi
  async findOne(id: string) {
    const nhuCau = await this.prisma.nhuCau.findFirst({ 
      where: { id, isDeleted: false } 
    });
    if (!nhuCau) throw new NotFoundException(`Không tìm thấy nhu cầu: ${id}`);
    return nhuCau;
  }

  // 5. Tạo mới
  async create(data: CreateNhuCauDto) {
    // 1. Tạo ID tự động
    const newId = `NC${Date.now()}`;

    return await this.prisma.nhuCau.create({
      data: {
        id: newId,
        khachHangId: data.khachHangId,
        loaiNC: data.loaiNC,
        loaiBDS: data.loaiBDS,
        viTri: data.viTri,
        dienTichMin: data.dienTichMin ? parseFloat(data.dienTichMin.toString()) : null,
        dienTichMax: data.dienTichMax ? parseFloat(data.dienTichMax.toString()) : null,
        ghiChu: data.ghiChu,
        isDeleted: false,
      },
    });
  }

  // 6. Cập nhật
  async update(id: string, data: UpdateNhuCauDto) {
    await this.findOne(id);
    
    // Tạo object để lưu các thay đổi
    const updateData: any = {
      loaiNC: data.loaiNC,
      loaiBDS: data.loaiBDS,
      viTri: data.viTri,
      dienTichMin: data.dienTichMin,
      dienTichMax: data.dienTichMax,
      ghiChu: data.ghiChu,
    };

    // Chỉ kết nối lại nếu có gửi khachHangId mới
    if (data.khachHangId) {
      updateData.khachHang = { connect: { id: data.khachHangId } };
    }

    return await this.prisma.nhuCau.update({ 
      where: { id }, 
      data: updateData
    });
  }

  // 7. Xóa mềm (Soft delete)
  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.nhuCau.update({ 
      where: { id }, 
      data: { isDeleted: true } // Prisma tự map true -> 1 trong DB
    });
  }
}