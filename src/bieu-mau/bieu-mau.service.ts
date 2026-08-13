import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class BieuMauService extends PrismaCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.whereKey = 'MaHoSo';

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  protected get delegate() {
    return this.prisma.hosobieumau;
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const isDocument =
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('document') ||
        file.mimetype.includes('msword') ||
        file.mimetype.includes('sheet');

      const ext = file.originalname.split('.').pop();
      const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      const safeFileName = `${nameWithoutExt}-${Date.now()}.${ext}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ho_so_bieu_mau',
          resource_type: isDocument ? 'raw' : 'auto',
          public_id: isDocument ? safeFileName : undefined,
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          if (result) return resolve(result.secure_url);
          reject(new Error('Không thể upload lên Cloudinary'));
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async createBieuMau(data: CreateBieuMauDto, file: Express.Multer.File) {
    let cloudUrl = '';
    if (file) {
      cloudUrl = await this.uploadToCloudinary(file);
    }

    return this.prisma.hosobieumau.create({
      data: {
        TenHoSo: data.tenHoSo,
        NoiDung: data.noiDung,
        DuongDan: cloudUrl,
      },
    });
  }

  async updateBieuMau(id: number, data: CreateBieuMauDto, file?: Express.Multer.File) {
    const existingBieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: id },
    });

    if (!existingBieuMau) {
      throw new NotFoundException(`Không tìm thấy hồ sơ biểu mẫu với ID: ${id}`);
    }

    let newCloudUrl = existingBieuMau.DuongDan;
    if (file) {
      newCloudUrl = await this.uploadToCloudinary(file);
    }

    return this.prisma.hosobieumau.update({
      where: { MaHoSo: id },
      data: {
        TenHoSo: data.tenHoSo !== undefined ? data.tenHoSo : existingBieuMau.TenHoSo,
        NoiDung: data.noiDung !== undefined ? data.noiDung : existingBieuMau.NoiDung,
        DuongDan: newCloudUrl,
      },
    });
  }

  async getFileForDownload(maHoSo: number) {
    const bieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: maHoSo },
    });

    if (!bieuMau) {
      throw new NotFoundException('Không tìm thấy hồ sơ biểu mẫu');
    }
    return bieuMau;
  }

  async findOne(id: number) {
    return await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: id },
    });
  }
}