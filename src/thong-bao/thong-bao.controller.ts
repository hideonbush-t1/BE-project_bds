import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateThongBaoDto } from './dto/create-thong-bao.dto';
import { UpdateThongBaoDto } from './dto/update-thong-bao.dto';
import { ThongBaoService } from './thong-bao.service';

@UseGuards(JwtAuthGuard, RolesGuard)
// BỎ @Roles('admin', 'employee') Ở ĐÂY ĐI
@Controller('thong-bao')
export class ThongBaoController {
  constructor(private readonly service: ThongBaoService) {}

  // 1. Phân quyền: Cả Admin và Employee đều được Xem danh sách
  @Roles('admin', 'employee')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'employee')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // 2. Phân quyền: CHỈ ADMIN mới được tạo thông báo
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateThongBaoDto, @Request() req: any) {
    // Bảo mật: Lấy ID người đăng nhập từ Token, ép đè vào DTO trước khi lưu
    // Giả sử req.user chứa thông tin giải mã từ JWT (như userId hoặc maNV)
    const currentUserId = req.user.id; 
    
    // Gán trực tiếp ID người tạo, bỏ qua giá trị FE gửi lên
    const safeDto = {
      ...dto,
      nhanVienId: currentUserId 
    };
    
    return this.service.create(safeDto);
  }

  // 3. Phân quyền: CHỈ ADMIN mới được sửa
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateThongBaoDto) {
    // Ngăn không cho sửa người tạo thông báo
    if (dto.nhanVienId) {
      delete dto.nhanVienId; 
    }
    return this.service.update(id, dto);
  }

  // 4. Phân quyền: CHỈ ADMIN mới được xóa
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}