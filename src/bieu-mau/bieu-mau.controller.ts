import { 
  Controller, Get, Param, Post, Delete, Put,
  UseGuards, ParseIntPipe, Body, UseInterceptors, UploadedFile, BadRequestException,
  Res 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import * as https from 'https';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BieuMauService } from './bieu-mau.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';

// --- BỘ LỌC ĐỊNH DẠNG FILE ---
const documentFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    'application/pdf', 
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Bảo mật: Chỉ cho phép tải lên file PDF hoặc Word (.doc, .docx)!'), false);
  }
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ho-so-bieu-mau')
export class BieuMauController {
  constructor(private readonly service: BieuMauService) {}

  @Get()
  @Roles('employee') // 💡 TỐI ƯU: Đổi thành 'employee', Admin sẽ tự động vào được
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('employee') // 💡 SỬA LỖI LOGIC: Cho phép nhân viên xem chi tiết biểu mẫu
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // THÊM BIỂU MẪU (Đã áp dụng bảo mật Upload)
  @Post()
  @Roles('admin') // 🔒 CHUẨN: Chỉ Admin mới được đăng biểu mẫu mới
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: documentFileFilter, // Gọi bộ lọc ở đây
    }),
  )
  async create(
    @Body() dto: CreateBieuMauDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng đính kèm file!');
    return this.service.createBieuMau(dto, file);
  }

  @Delete(':id')
  @Roles('admin') // 🔒 CHUẨN: Chỉ Admin mới được xóa
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id); 
  }

  // CẬP NHẬT BIỂU MẪU (Đã áp dụng bảo mật Upload)
  @Put(':id')
  @Roles('admin') // 🔒 CHUẨN: Chỉ Admin mới được sửa nội dung biểu mẫu
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: documentFileFilter, // Gọi bộ lọc ở đây
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBieuMauDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.updateBieuMau(id, dto, file);
  }

  @Get('download/:id')
  @Roles('admin', 'employee')
  async downloadFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const bieuMau = await this.service.getFileForDownload(id);
    if (!bieuMau.DuongDan) throw new BadRequestException('Hồ sơ biểu mẫu này chưa có file đính kèm.');

    const ext = bieuMau.DuongDan.split('.').pop() || 'pdf';
    const safeFileName = `${bieuMau.TenHoSo.replace(/\s+/g, '_')}.${ext}`;

    https.get(bieuMau.DuongDan, (fileStream) => {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFileName)}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);
    }).on('error', () => {
      throw new BadRequestException('Không thể kết nối đến máy chủ Cloudinary');
    });
  }
}