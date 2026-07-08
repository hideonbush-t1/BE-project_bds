import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';
import { NhuCauService } from './nhu-cau.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('employee') // 🔓 MỞ CỬA: Cả Employee và Admin đều làm việc được
@Controller('nhu-cau')
export class NhuCauController {
  constructor(private readonly service: NhuCauService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNhuCauDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNhuCauDto) {
    return this.service.update(id, dto);
  }

  // 🔒 NÂNG CẤP BẢO MẬT: Chỉ Admin mới được Xóa nhu cầu
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}