import { 
  Controller, Get, Param, Post, Res, StreamableFile, Delete,
  UseGuards, NotFoundException, ParseIntPipe, Body, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BieuMauService } from './bieu-mau.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';
import { memoryStorage } from 'multer';

// Đảm bảo thư mục upload tồn tại
const uploadDir = join(process.cwd(), 'uploads', 'bieu-mau');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('bieu-mau')
export class BieuMauController {
  constructor(private readonly service: BieuMauService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ==========================================
  // 1. API THÊM BIỂU MẪU (KÈM UPLOAD FILE)
  // ==========================================
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // <-- Ép buộc lưu tạm vào RAM để lấy file.buffer
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
  // 2. API TẢI VỀ BIỂU MẪU
  // ==========================================
  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    
    const bieuMau = await this.service.getFileForDownload(id);
    const filePath = join(uploadDir, bieuMau.duongDan);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File vật lý không tồn tại trên server');
    }

    const fileExtension = extname(bieuMau.duongDan) || '.pdf';
    const safeFileName = encodeURIComponent(bieuMau.tenHoSo) + fileExtension;

    const fileStream = createReadStream(filePath);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${safeFileName}`,
    });

    return new StreamableFile(fileStream);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // Gọi hàm remove từ PrismaCrudService có sẵn
    return this.service.remove(id); 
  }
}