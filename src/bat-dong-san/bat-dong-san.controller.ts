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
  BadRequestException
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, { 
      storage: memoryStorage() 
    })
  ) 
  create(
    @Body() dto: CreateBatDongSanDto,
    @UploadedFiles() files: Array<Express.Multer.File> 
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng tải lên ít nhất 1 hình ảnh!');
    }
    return this.service.create(dto, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, { 
      storage: memoryStorage() 
    })
  )
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateBatDongSanDto,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ) {
    return this.service.update(id, dto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}