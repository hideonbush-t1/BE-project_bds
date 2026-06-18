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
    // 1. Sửa thành 'MaHoSo' (Viết hoa chữ M theo đúng schema)
    this.whereKey = 'MaHoSo'; 

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  protected get delegate() {
    // 2. Sửa thành hosobieumau (Viết thường toàn bộ theo đúng schema)
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
        // 3. Thêm kiểu :any vào error và result để fix lỗi TS7006
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

    // 4. Sửa tên cột theo đúng định dạng Viết Hoa đầu từ của file schema
    return this.prisma.hosobieumau.create({
      data: {
        TenHoSo: data.tenHoSo,
        NoiDung: data.noiDung,
        DuongDan: cloudUrl, 
      },
    });
  }

  async getFileForDownload(maHoSo: number) {
    // 5. Tìm kiếm theo 'MaHoSo' (viết hoa chữ M)
    const bieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: maHoSo },
    });

    if (!bieuMau) {
      throw new NotFoundException('Không tìm thấy hồ sơ biểu mẫu');
    }

    return bieuMau;
  }
  async updateBieuMau(id: number, data: CreateBieuMauDto, file?: Express.Multer.File) {
    // 1. Kiểm tra biểu mẫu có tồn tại trong database không
    const existingBieuMau = await this.prisma.hosobieumau.findUnique({
      where: { MaHoSo: id },
    });

    if (!existingBieuMau) {
      throw new NotFoundException(`Không tìm thấy hồ sơ biểu mẫu với ID: ${id}`);
    }

    // 2. Xử lý đường dẫn file
    let newCloudUrl = existingBieuMau.DuongDan; // Mặc định giữ nguyên link cũ
    
    // Nếu Client có gửi file mới lên, tiến hành upload và ghi đè link
    if (file) {
      newCloudUrl = await this.uploadToCloudinary(file);
      
      // (Tùy chọn) Tại đây bạn có thể gọi API của Cloudinary để xóa file cũ 
      // dựa trên public_id để tiết kiệm dung lượng cloud.
    }

    // 3. Cập nhật dữ liệu mới vào Database
    return this.prisma.hosobieumau.update({
      where: { MaHoSo: id },
      data: {
        TenHoSo: data.tenHoSo !== undefined ? data.tenHoSo : existingBieuMau.TenHoSo,
        NoiDung: data.noiDung !== undefined ? data.noiDung : existingBieuMau.NoiDung,
        DuongDan: newCloudUrl, 
      },
    });
  }
}