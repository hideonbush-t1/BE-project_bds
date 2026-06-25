import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';

@Injectable()
export class BatDongSanService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.batDongSan;
  }

  // SỬA LỖI: Tối ưu bộ lọc để tránh lỗi undefined trong OR
  async filter(loaiBDS?: string, viTri?: string) {
    const whereCondition: any = { isDeleted: false };

    if (loaiBDS) {
      whereCondition.loaiBDS = { contains: loaiBDS };
    }

    if (viTri) {
      whereCondition.OR = [
        { diaChi: { contains: viTri } },
        { chiTiet: { viTri: { contains: viTri } } }
      ];
    }

    return this.prisma.batDongSan.findMany({
      where: whereCondition,
      select: {
        id: true,
        loaiBDS: true,
        diaChi: true,
        dienTich: true,
        giaTien: true,
        tinhTrang: true,
        chiTiet: { select: { viTri: true } }
      },
      orderBy: { ngayTao: 'desc' },
    });
  }

  findAll() {
    return this.prisma.batDongSan.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        khachHangId: true,
        tieuDe: true,
        loaiBDS: true,
        diaChi: true,
        dienTich: true,
        giaTien: true,
        tinhTrang: true,
        ngayTao: true,
      },
      orderBy: { ngayTao: 'desc' },
    });
  }

  async create(data: CreateBatDongSanDto) {
    const { huong, moTa, ...batDongSanData } = data;
    const propertyId = `BDS${Date.now()}`;
    
    return this.prisma.batDongSan.create({
      data: {
        ...batDongSanData,
        id: propertyId,
        isDeleted: false,
        ngayTao: new Date(),
        // Nếu chiTiet là một bảng liên kết (Relation), dùng cấu trúc connectOrCreate hoặc create
        chiTiet: (huong || moTa) ? { 
            create: { huong, moTa } 
        } : undefined,
      },
    });
  }

  async update(id: string, data: UpdateBatDongSanDto) {
    // Tối ưu: Dùng spread trực tiếp cho các trường đơn giản
    return this.prisma.batDongSan.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}