import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  UseGuards,
  Query // 💡 THÊM IMPORT Query Ở ĐÂY
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NhanVienService } from './nhan-vien.service';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto';
import { UpdateNhanVienDto } from './dto/update-nhan-vien.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
// Mở rộng quyền cho cả 'admin' và 'employee' để tránh lỗi 403
@Roles('admin', 'employee')
@Controller('nhan-vien')
export class NhanVienController {
  constructor(private readonly service: NhanVienService) {}

  // 💡 SỬA TẠI ĐÂY: Hứng tham số ?search=... từ Frontend
  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNhanVienDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNhanVienDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}