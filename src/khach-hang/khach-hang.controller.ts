import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
import { KhachHangService } from './khach-hang.service';

@UseGuards(JwtAuthGuard, RolesGuard)
// Đảm bảo @Roles bao gồm cả 'admin' và 'employee' để cả 2 đều có quyền truy cập
@Roles('admin', 'employee')
@Controller('khach-hang')
export class KhachHangController {
  constructor(private readonly service: KhachHangService) {}

  @Get()
  findAll(@Query() query: { loaiKH?: string; search?: string }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateKhachHangDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKhachHangDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/nhu-cau')
  findNhuCauByKhachHang(@Param('id') id: string) {
    return this.service.findNhuCauByKhachHang(id);
  }

  @Get(':id/bat-dong-san')
  findBatDongSanByKhachHang(@Param('id') id: string) {
    return this.service.findBatDongSanByKhachHang(id);
  }
}