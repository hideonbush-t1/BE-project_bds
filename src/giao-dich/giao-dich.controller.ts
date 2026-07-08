import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateGiaoDichDto } from './dto/create-giao-dich.dto';
import { UpdateGiaoDichDto } from './dto/update-giao-dich.dto';
import { GiaoDichService } from './giao-dich.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('employee') // 💡 TỐI ƯU: Đặt quyền gốc là 'employee' (Admin tự động pass)
@Controller('giao-dich')
export class GiaoDichController {
  constructor(private readonly service: GiaoDichService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // THÊM MỚI: API Gợi ý (Matching) - PHẢI ĐẶT TRÊN @Get(':id')
  @Get('suggest/:nhuCauId')
  suggestMatching(@Param('nhuCauId') nhuCauId: string) {
    return this.service.suggest(nhuCauId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGiaoDichDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGiaoDichDto) {
    return this.service.update(id, dto);
  }

  // 💡 NÂNG CẤP BẢO MẬT: Chỉ Admin mới được xóa lịch sử giao dịch
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}