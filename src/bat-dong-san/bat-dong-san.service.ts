import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class BatDongSanService extends PrismaCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.whereKey = 'id';

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  protected get delegate() {
    return this.prisma.batDongSan;
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const ext = file.originalname.split('.').pop();
      const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      const safeFileName = `${nameWithoutExt}-${Date.now()}.${ext}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'bat_dong_san', 
          resource_type: 'auto',
          public_id: safeFileName, 
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary không trả về đường dẫn ảnh'));
          }
        },
      );
      
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  findAll() {
    return this.prisma.batDongSan.findMany({
      where: { isDeleted: false },
      include: { hinhAnhs: true },
      orderBy: { id: 'asc' },
    });
  }

  async filter(loaiBDS: string, viTri: string) {
    return await this.prisma.batDongSan.findMany({
      where: {
        isDeleted: false,
        loaiBDS: loaiBDS,
        viTri: { contains: viTri },
      },
    });
  }

  async search(loaiBDS?: string, viTri?: string, diaChi?: string, giaMin?: number, giaMax?: number, huong?: string) {
    const where: any = { isDeleted: false };
    if (loaiBDS) where.loaiBDS = loaiBDS;
    if (huong) where.huong = huong;
    if (viTri) where.viTri = { contains: viTri.trim() };
    if (diaChi) where.diaChi = { contains: diaChi.trim() };

    if (giaMin !== undefined || giaMax !== undefined) {
      where.giaTien = {};
      if (giaMin !== undefined) where.giaTien.gte = giaMin; 
      if (giaMax !== undefined) where.giaTien.lte = giaMax; 
    }

    return this.prisma.batDongSan.findMany({ where, include: { hinhAnhs: true } });
  }

  async findOne(id: string) {
    const bds = await this.prisma.batDongSan.findUnique({
      where: { id },
      include: { hinhAnhs: true },
    });
    if (!bds) throw new NotFoundException(`Không tìm thấy Bất động sản: ${id}`);
    return bds;
  }

  // ==========================================
  // THÊM MỚI (Đã sửa lỗi nested create)
  // ==========================================
  async create(data: CreateBatDongSanDto, files?: Array<Express.Multer.File>) {
    const imageUrls = files ? await Promise.all(files.map(f => this.uploadToCloudinary(f))) : [];

    const lastBDS = await this.prisma.batDongSan.findFirst({
      where: { id: { startsWith: 'BDS' } },
      orderBy: { id: 'desc' },
    });

    let newId = 'BDS001';
    if (lastBDS) {
      const lastNumber = parseInt(lastBDS.id.replace('BDS', ''), 10);
      newId = `BDS${(lastNumber + 1).toString().padStart(3, '0')}`;
    }

    return this.prisma.batDongSan.create({
      data: {
        id: newId,
        ...data,
        isDeleted: false,
        ngayTao: new Date(),
        hinhAnhs: {
          create: imageUrls.map((url, index) => ({
            // KHÔNG CẦN TRUYỀN ID NỮA VÌ ĐÃ CÓ autoincrement()
            duongDan: url,
            anhDaiDien: index === 0,
          }))
        }
      },
    });
  }

  async update(id: string, data: UpdateBatDongSanDto, files?: Array<Express.Multer.File>) {
    return this.prisma.batDongSan.update({ where: { id }, data: { ...data } });
  }

  async remove(id: string) {
    return this.prisma.batDongSan.update({ where: { id }, data: { isDeleted: true } });
  }
}