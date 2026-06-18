import { Injectable ,NotFoundException} from '@nestjs/common';
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

  async create(data: CreateBatDongSanDto, files?: Array<Express.Multer.File>) {
    const { huong, moTa, ...batDongSanData } = data;
    
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
        khachHangId: batDongSanData.khachHangId,
        nhuCau: batDongSanData.nhuCau ?? null,
        tieuDe: batDongSanData.tieuDe,
        loaiBDS: batDongSanData.loaiBDS,
        diaChi: batDongSanData.diaChi,
        dienTich: batDongSanData.dienTich,
        giaTien: batDongSanData.giaTien as any,
        tinhTrang: batDongSanData.tinhTrang,
        isDeleted: false,
        ngayTao: new Date(),
        viTri: null,
        huong: huong ?? null,
        ghiChu: moTa ?? null,
        chiTiet: huong || moTa ? { create: { huong, moTa } } : undefined,
        
        ...(imageUrls.length > 0 && {
          hinhAnhs: {
            create: imageUrls.map((url, index) => ({
              id: Math.floor(Date.now() / 1000) + index, // ID tự sinh cho ảnh
              duongDan: url,
              anhDaiDien: index === 0, 
            }))
          }
        })
      },
    });
  }
  async findOne(id: string) {
    const bds = await this.prisma.batDongSan.findUnique({
      where: { id },
      include: {
        hinhAnhs: true, // <--- Lệnh này cực kỳ quan trọng để kéo dữ liệu từ bảng HinhAnhBDS
      },
    });

    if (!bds) {
      throw new NotFoundException(`Không tìm thấy Bất động sản với mã: ${id}`);
    }

    return bds;
  }


  async update(id: string, data: UpdateBatDongSanDto, files?: Array<Express.Multer.File>) {
    const newImageUrls = files ? await Promise.all(files.map(f => this.uploadToCloudinary(f))) : [];

    return this.prisma.batDongSan.update({
      where: { id },
      data: {
        ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
        ...(data.tieuDe ? { tieuDe: data.tieuDe } : {}),
        ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
        ...(data.diaChi ? { diaChi: data.diaChi } : {}),
        ...(data.dienTich !== undefined ? { dienTich: data.dienTich } : {}),
        ...(data.giaTien ? { giaTien: data.giaTien as any } : {}),
        ...(data.nhuCau ? { nhuCau: data.nhuCau } : {}),
        ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}),
        
        ...(newImageUrls.length > 0 ? {
          hinhAnhs: {
            create: newImageUrls.map((url, index) => ({
              id: Math.floor(Date.now() / 1000) + index,
              duongDan: url,
              anhDaiDien: false,
            }))
          }
        } : {})
      },
    });
  }
}