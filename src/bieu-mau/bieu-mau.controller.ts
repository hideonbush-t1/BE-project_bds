import { 
  Controller, Get, Param, Post, Delete,
  UseGuards, ParseIntPipe, Body, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BieuMauService } from './bieu-mau.service';
import { CreateBieuMauDto } from './dto/create-bieu-mau.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ho-so-bieu-mau') // Đã đồng bộ với Frontend (api.get('/bieu-mau'))
export class BieuMauController {
  constructor(private readonly service: BieuMauService) {}

  // ==========================================
  // 1. LẤY DANH SÁCH BIỂU MẪU
  // ==========================================
  @Get() // Route này sẽ là: GET /ho-so-bieu-mau
  @Roles('admin')
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
      storage: memoryStorage(), // Ép buộc lưu tạm vào RAM để lấy file.buffer
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
}