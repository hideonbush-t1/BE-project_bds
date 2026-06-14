import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';

@Injectable()
export class BieuMauService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'maHoSo'; 
  }

  protected get delegate() {
    return this.prisma.hoSoBieuMau; 
  }

  // 1. Hàm thêm mới biểu mẫu vào Database
  async createBieuMau(data: CreateBieuMauDto, fileName: string) {
    return this.prisma.hoSoBieuMau.create({
      data: {
        tenHoSo: data.tenHoSo,
        noiDung: data.noiDung,
        duongDan: fileName, // Lưu tên file vật lý vào DB
      },
    });
  }

  // 2. Hàm lấy thông tin để tải file
  async getFileForDownload(maHoSo: number) {
    const bieuMau = await this.prisma.hoSoBieuMau.findUnique({
      where: { maHoSo },
    });

    if (!bieuMau) {
      throw new NotFoundException('Không tìm thấy hồ sơ biểu mẫu');
    }

    return bieuMau;
  }
}