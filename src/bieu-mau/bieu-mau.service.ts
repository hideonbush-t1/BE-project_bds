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
  // Đã sửa tham số nhận vào là string hoặc number để Controller truyền vào linh hoạt
  async getFileForDownload(id: string | number) {
    // Ép kiểu về number để khớp với MaHoSo trong Prisma schema
    const maHoSo = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(maHoSo)) {
      throw new NotFoundException('ID không hợp lệ');
    }

    const bieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: maHoSo },
    });

    if (!bieuMau) {
      throw new NotFoundException('Không tìm thấy hồ sơ biểu mẫu');
    }

    return bieuMau;
  }

  // Bổ sung hàm findOne cho Controller
  async findOne(id: string | number) {
    const maHoSo = typeof id === 'string' ? parseInt(id, 10) : id;
    return await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: maHoSo },
    });
  }
}