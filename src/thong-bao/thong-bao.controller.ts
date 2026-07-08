import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateThongBaoDto } from './dto/create-thong-bao.dto';
import { UpdateThongBaoDto } from './dto/update-thong-bao.dto';
import { ThongBaoService } from './thong-bao.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('thong-bao')
export class ThongBaoController {
  constructor(private readonly service: ThongBaoService) {}

  // 🔓 Phân quyền: Cả Admin và Employee đều được Xem danh sách
  @Roles('employee') // 💡 TỐI ƯU: Chỉ cần 'employee', Admin tự động vào được
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('employee') // 💡 TỐI ƯU
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // 🔒 Phân quyền: CHỈ ADMIN mới được tạo thông báo
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateThongBaoDto, @Request() req: any) {
    // Lấy ID từ Token (thường là req.user.sub hoặc req.user.id tùy cấu hình JWT của bạn)
    const currentUserId = req.user.sub || req.user.id; 
    
    const safeDto = {
      ...dto,
      nhanVienId: currentUserId 
    };
    
    return this.service.create(safeDto);
  }

  // 🔒 Phân quyền: CHỈ ADMIN mới được sửa
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateThongBaoDto) {
    if (dto.nhanVienId) {
      delete dto.nhanVienId; 
    }
    return this.service.update(id, dto);
  }

  // 🔒 Phân quyền: CHỈ ADMIN mới được xóa
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}