import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';

@Injectable()
export class BieuMauService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'MaHoSo'; 
  }

  protected get delegate() {
    return this.prisma.hosobieumau;
  }

  // 1. Hàm thêm mới biểu mẫu vào Database
  async createBieuMau(data: CreateBieuMauDto, fileName: string) {
    return this.prisma.hosobieumau.create({
      data: {
        TenHoSo: data.tenHoSo,
        NoiDung: data.noiDung,
        DuongDan: fileName, // Lưu tên file vật lý vào DB
      },
    });
  }

  // 2. Hàm lấy thông tin để tải file
  async getFileForDownload(maHoSo: number) {
    const bieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: maHoSo },
    });

    if (!bieuMau) {
      throw new NotFoundException('Không tìm thấy hồ sơ biểu mẫu');
    }

    return bieuMau;
  }
}