import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier'; // Cần để chuyển file dạng Buffer lên Cloud

@Injectable()
export class BieuMauService extends PrismaCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService, // Tiêm ConfigService vào
  ) {
    super();
    this.whereKey = 'maHoSo'; 

    // Cấu hình Cloudinary tự động lấy khóa từ file .env
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  protected get delegate() {
    return this.prisma.hoSoBieuMau; 
  }

  // Hàm phụ trợ: Đẩy file nhị phân (Buffer) lên Cloudinary
  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      
      const isDocument = 
        file.mimetype.includes('pdf') || 
        file.mimetype.includes('document') || 
        file.mimetype.includes('msword') ||
        file.mimetype.includes('sheet');

      // --- PHẦN MỚI THÊM ĐỂ GIỮ ĐUÔI FILE ---
      // Lấy đuôi file gốc (vd: 'pdf', 'docx')
      const ext = file.originalname.split('.').pop();
      // Lấy tên file gốc (bỏ đuôi đi)
      const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
      // Ghép lại thành tên mới chống trùng lặp nhưng VẪN CÓ ĐUÔI
      const safeFileName = `${nameWithoutExt}-${Date.now()}.${ext}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'ho_so_bieu_mau',
          resource_type: isDocument ? 'raw' : 'auto',
          // Ép Cloudinary dùng cái tên có đuôi .pdf / .docx này làm ID
          public_id: isDocument ? safeFileName : undefined, 
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result.secure_url);
          reject(new Error('Không thể upload lên Cloudinary'));
        },
      );
      
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // 1. Hàm thêm mới biểu mẫu vào Database
  async createBieuMau(data: CreateBieuMauDto, file: Express.Multer.File) {
    let cloudUrl = '';

    // Nếu người dùng có gửi file, tiến hành đưa lên mây
    if (file) {
      cloudUrl = await this.uploadToCloudinary(file);
    }

    // Lưu vào database với đường dẫn là link Cloudinary thay vì tên file vật lý
    return this.prisma.hoSoBieuMau.create({
      data: {
        tenHoSo: data.tenHoSo,
        noiDung: data.noiDung,
        duongDan: cloudUrl, 
      },
    });
  }

  // 2. Hàm lấy thông tin (Giữ nguyên cho các API khác nếu cần)
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