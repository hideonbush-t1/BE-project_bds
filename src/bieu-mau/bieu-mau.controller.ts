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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ho-so-bieu-mau')
export class BieuMauController {
  constructor(private readonly service: BieuMauService) {}

  // ==========================================
  // 1. LẤY DANH SÁCH BIỂU MẪU
  // ==========================================
  @Get()
  @Roles('admin', 'employee')
  findAll() {
    return this.service.findAll();
  }

  // ==========================================
  // 2. LẤY CHI TIẾT 1 BIỂU MẪU
  // ==========================================
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ==========================================
  // 3. THÊM BIỂU MẪU (LƯU LÊN CLOUDINARY)
  // ==========================================
  @Post()
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async create(
    @Body() dto: CreateBieuMauDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng đính kèm file!');
    }
    return this.service.createBieuMau(dto, file);
  }

  // ==========================================
  // 4. XÓA BIỂU MẪU
  // ==========================================
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id); 
  }

  // ==========================================
  // 5. CẬP NHẬT BIỂU MẪU (SỬA)
  // ==========================================
  @Put(':id')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateBieuMauDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.updateBieuMau(id, dto, file);
  }

  // ==========================================
  // 6. TẢI FILE VỀ MÁY (ÉP DOWNLOAD)
  // ==========================================
  @Get('download/:id')
  @Roles('admin', 'employee')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const bieuMau = await this.service.getFileForDownload(id);

    if (!bieuMau.DuongDan) {
      throw new BadRequestException('Hồ sơ biểu mẫu này chưa có file đính kèm.');
    }

    const ext = bieuMau.DuongDan.split('.').pop() || 'pdf';
    const safeFileName = `${bieuMau.TenHoSo.replace(/\s+/g, '_')}.${ext}`;

    https.get(bieuMau.DuongDan, (fileStream) => {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeFileName)}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);
    }).on('error', () => {
      throw new BadRequestException('Không thể kết nối đến máy chủ Cloudinary để tải file');
    });
  }
}