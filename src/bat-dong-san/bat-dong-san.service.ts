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

    // Cấu hình Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  protected get delegate() {
    return this.prisma.batDongSan;
  }

  // ==========================================
  // HÀM UPLOAD ẢNH LÊN CLOUDINARY
  // ==========================================
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

  // ==========================================
  // LẤY DANH SÁCH BẤT ĐỘNG SẢN
  // ==========================================
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
        viTri: true,
        huong: true,
        ghiChu: true,
        hinhAnhs: {
          select: {
            id: true,
            duongDan: true,
            anhDaiDien: true,
          }
        }
      },
      orderBy: { id: 'asc' },
    });
  }

  // ==========================================
  // HÀM TÌM KIẾM NÂNG CAO (ĐÃ TÁCH ĐỊA CHỈ & VỊ TRÍ)
// ==========================================
  async search(
    loaiBDS?: string, 
    viTri?: string, 
    diaChi?: string, // Thêm tham số diaChi
    giaMin?: number, 
    giaMax?: number, 
    huong?: string
  ) {
    const where: any = {
      isDeleted: false,
    };

    if (loaiBDS) {
      where.loaiBDS = loaiBDS;
    }

    if (huong) {
      where.huong = huong;
    }

    // Tìm kiếm độc lập theo Vị trí (cắt khoảng trắng 2 đầu)
    if (viTri) {
      where.viTri = { contains: viTri.trim() };
    }

    // Tìm kiếm độc lập theo Địa chỉ (cắt khoảng trắng 2 đầu)
    if (diaChi) {
      where.diaChi = { contains: diaChi.trim() };
    }

    if (giaMin !== undefined || giaMax !== undefined) {
      where.giaTien = {};
      if (giaMin !== undefined) where.giaTien.gte = giaMin; 
      if (giaMax !== undefined) where.giaTien.lte = giaMax; 
    }

    return this.prisma.batDongSan.findMany({
      where,
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
        viTri: true, // Lấy thêm trường viTri để kiểm tra ở Frontend
        hinhAnhs: {
          select: {
            id: true,
            duongDan: true,
            anhDaiDien: true,
          }
        }
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // ==========================================
  // LẤY CHI TIẾT 1 BẤT ĐỘNG SẢN
  // ==========================================
  async findOne(id: string) {
    const bds = await this.prisma.batDongSan.findUnique({
      where: { id },
      include: {
        hinhAnhs: true, 
      },
    });

    if (!bds) {
      throw new NotFoundException(`Không tìm thấy Bất động sản với mã: ${id}`);
    }

    return bds;
  }

  // ==========================================
  // THÊM MỚI BẤT ĐỘNG SẢN
  // ==========================================
  async create(data: CreateBatDongSanDto, files?: Array<Express.Multer.File>) {
    // Upload tất cả file lên Cloudinary nếu có
    const imageUrls = files ? await Promise.all(files.map(f => this.uploadToCloudinary(f))) : [];

    const lastBDS = await this.prisma.batDongSan.findFirst({
      where: { id: { startsWith: 'BDS0' } },
      orderBy: { id: 'desc' },
    });

    let newId = 'BDS001';
    if (lastBDS && lastBDS.id) {
      const lastNumber = parseInt(lastBDS.id.replace('BDS', ''), 10);
      if (!isNaN(lastNumber)) {
        newId = `BDS${(lastNumber + 1).toString().padStart(3, '0')}`;
      }
    }

    return this.prisma.batDongSan.create({
      data: {
        id: newId,
        khachHangId: data.khachHangId,
        nhuCau: data.nhuCau ?? null,
        tieuDe: data.tieuDe,
        loaiBDS: data.loaiBDS,
        diaChi: data.diaChi,
        dienTich: data.dienTich,
        giaTien: data.giaTien as any,
tinhTrang: data.tinhTrang,
        isDeleted: false,
        ngayTao: new Date(),
        viTri: data.viTri ?? null,
        huong: data.huong ?? null,
        ghiChu: data.ghiChu ?? data.moTa ?? null,
        chiTiet: data.huong || data.moTa ? { create: { huong: data.huong, moTa: data.moTa } } : undefined,
        
        ...(imageUrls.length > 0 && {
          hinhAnhs: {
            create: imageUrls.map((url, index) => ({
              id: Math.floor(Date.now() / 1000) + index, 
              duongDan: url,
              anhDaiDien: index === 0, 
            }))
          }
        })
      },
    });
  }

  // ==========================================
  // CẬP NHẬT BẤT ĐỘNG SẢN (Đã xử lý xóa ảnh cũ)
  // ==========================================
  async update(id: string, data: UpdateBatDongSanDto, files?: Array<Express.Multer.File>) {
    const newImageUrls = files ? await Promise.all(files.map(f => this.uploadToCloudinary(f))) : [];

    // 1. Chuyển đổi mảng deletedImages (dạng chuỗi JSON) thành mảng ID (số)
    let deletedImageIds: number[] = [];
    if (data.deletedImages) {
      try {
        deletedImageIds = JSON.parse(data.deletedImages);
      } catch (e) {
        console.error("Lỗi khi đọc danh sách ảnh cần xóa:", e);
      }
    }

    return this.prisma.batDongSan.update({
      where: { id },
      data: {
        ...(data.khachHangId !== undefined ? { khachHangId: data.khachHangId } : {}),
        ...(data.tieuDe !== undefined ? { tieuDe: data.tieuDe } : {}),
        ...(data.loaiBDS !== undefined ? { loaiBDS: data.loaiBDS } : {}),
        ...(data.diaChi !== undefined ? { diaChi: data.diaChi } : {}),
        ...(data.dienTich !== undefined ? { dienTich: data.dienTich } : {}),
        ...(data.giaTien !== undefined ? { giaTien: data.giaTien as any } : {}),
        ...(data.nhuCau !== undefined ? { nhuCau: data.nhuCau } : {}),
        ...(data.tinhTrang !== undefined ? { tinhTrang: data.tinhTrang } : {}),
        ...(data.viTri !== undefined ? { viTri: data.viTri } : {}),
        ...(data.huong !== undefined ? { huong: data.huong } : {}),
        ...(data.ghiChu !== undefined ? { ghiChu: data.ghiChu } : {}),
        
        // 2. Logic xử lý xóa ảnh cũ và thêm ảnh mới vào Database
        ...(newImageUrls.length > 0 || deletedImageIds.length > 0 ? {
          hinhAnhs: {
            // Lệnh xóa các ảnh nằm trong mảng deletedImageIds
            ...(deletedImageIds.length > 0 ? {
              deleteMany: {
                id: { in: deletedImageIds }
              }
            } : {}),
            
            // Lệnh tạo mới các ảnh vừa upload
            ...(newImageUrls.length > 0 ? {
              create: newImageUrls.map((url, index) => ({
                id: Math.floor(Date.now() / 1000) + index,
                duongDan: url,
                anhDaiDien: false,
              }))
            } : {})
          }
        } : {})
},
    });
  }

  // ==========================================
  // XÓA MỀM BẤT ĐỘNG SẢN
  // ==========================================
  async remove(id: string) {
    const bds = await this.prisma.batDongSan.findUnique({
      where: { id },
    });

    if (!bds) {
      throw new NotFoundException(`Không tìm thấy Bất động sản với mã: ${id}`);
    }

    return this.prisma.batDongSan.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}