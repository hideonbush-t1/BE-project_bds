import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';

@Injectable()
export class NhuCauService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.nhuCau;
  }

  async create(data: CreateNhuCauDto) {
    return this.prisma.nhuCau.create({
      data: {
        id: `NC${Date.now()}`.slice(0, 10),
        khachHangId: data.khachHangId,
        nhanVienId: data.nhanVienId,

        loaiNC: data.loaiNhuCau || '', 
        loaiBDS: data.loaiBDS || '',
        viTri: data.viTri || '',
        
        dienTichMin: data.dienTichMin ? Number(data.dienTichMin) : null,
        dienTichMax: data.dienTichMax ? Number(data.dienTichMax) : null,
        ghiChu: data.ghiChu,
        tinhTrang: data.tinhTrang || 'Đang tìm kiếm',
      },
    });
  }

  update(id: string, data: UpdateNhuCauDto) {
    return this.prisma.nhuCau.update({
      where: { id },
      data: {
        ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
        ...(data.nhanVienId ? { nhanVienId: data.nhanVienId } : {}), // Thêm dòng này để Admin sửa được nhân viên
        ...(data.loaiNhuCau ? { loaiNC: data.loaiNhuCau } : {}),
        ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
        ...(data.viTri ? { viTri: data.viTri } : {}),
        ...(data.dienTichMin !== undefined ? { dienTichMin: data.dienTichMin } : {}),
        ...(data.dienTichMax !== undefined ? { dienTichMax: data.dienTichMax } : {}),
        ...(data.ghiChu ? { ghiChu: data.ghiChu } : {}),
        ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}), 
      },
    });
  }
}