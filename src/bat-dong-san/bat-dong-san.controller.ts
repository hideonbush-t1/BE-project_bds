import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  BadRequestException,
  Query 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BatDongSanService } from './bat-dong-san.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('bat-dong-san')
export class BatDongSanController {
  constructor(private readonly service: BatDongSanService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(
    @Query('loaiBDS') loaiBDS?: string,
    @Query('viTri') viTri?: string,
    @Query('diaChi') diaChi?: string,
    @Query('giaMin') giaMin?: string,
    @Query('giaMax') giaMax?: string,
    @Query('huong') huong?: string,
  ) {
    const parsedGiaMin = giaMin ? Number(giaMin) : undefined;
    const parsedGiaMax = giaMax ? Number(giaMax) : undefined;
    return this.service.search(loaiBDS, viTri, diaChi, parsedGiaMin, parsedGiaMax, huong);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ==========================================
  // HÀM KIỂM TRA ĐIỀU KIỆN FILE TRƯỚC KHI XỬ LÝ
  // ==========================================
  private validateFiles(files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) return;
    
    if (files.length > 10) {
      throw new BadRequestException('Hệ thống chỉ cho phép tải lên tối đa 10 tài nguyên.');
    }

    let videoCount = 0;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        if (file.size > MAX_IMAGE_SIZE) {
          throw new BadRequestException(`Ảnh [${file.originalname}] vượt quá dung lượng 5MB.`);
        }
      } else if (file.mimetype.startsWith('video/')) {
        videoCount++;
        if (videoCount > 1) {
          throw new BadRequestException('Hệ thống chỉ cho phép đính kèm tối đa 1 video cho mỗi bài đăng.');
        }
        if (file.size > MAX_VIDEO_SIZE) {
          throw new BadRequestException(`Video [${file.originalname}] vượt quá dung lượng 20MB.`);
        }
      } else {
        throw new BadRequestException(`Tệp [${file.originalname}] không đúng định dạng hình ảnh hoặc video.`);
      }
    }
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, { 
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 } // Giới hạn an toàn toàn cục 20MB để chống nghẽn RAM
    })
  ) 
  create(
    @Body() dto: CreateBatDongSanDto,
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng tải lên ít nhất 1 hình ảnh hoặc video!');
    }
    
    // Gọi hàm kiểm tra khắt khe
    this.validateFiles(files);
    
    return this.service.create(dto, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, { 
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 }
    })
  )
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateBatDongSanDto,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ) {
    // Nếu có gửi file mới lên thì mới kiểm tra
    if (files && files.length > 0) {
      this.validateFiles(files);
    }
    
    return this.service.update(id, dto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}