import { 
  Controller, Get, Param, Post, Res, StreamableFile, 
  UseGuards, NotFoundException, Body, UseInterceptors, UploadedFile, BadRequestException 
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

const uploadDir = join(process.cwd(), 'uploads', 'bieu-mau');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('ho-so-bieu-mau') 
export class BieuMauController {
  constructor(private readonly service: BieuMauService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Nếu Service của bạn vẫn yêu cầu number, hãy đổi thành: Number(id)
    return await this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `bieumau-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateBieuMauDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Vui lòng đính kèm file!');
    return await this.service.createBieuMau(dto, file.filename);
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const bieuMau = await this.service.getFileForDownload(id);
    if (!bieuMau) throw new NotFoundException('Không tìm thấy dữ liệu biểu mẫu');

    const filePath = join(uploadDir, bieuMau.DuongDan);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File vật lý không tồn tại trên server');
    }

    const fileExtension = extname(bieuMau.DuongDan) || '.pdf';
    const safeFileName = encodeURIComponent(bieuMau.TenHoSo) + fileExtension;

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${safeFileName}`,
    });

    return new StreamableFile(createReadStream(filePath));
  }
}