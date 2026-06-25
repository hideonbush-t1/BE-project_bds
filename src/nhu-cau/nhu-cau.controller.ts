import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';
import { NhuCauService } from './nhu-cau.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('nhu-cau')
export class NhuCauController {
  constructor(private readonly service: NhuCauService) {}

  @Get('search')
  async search(@Query() query: { q?: string }) {
    return this.service.findManyWithFilters(query);
  }

  @Get('khach-hang/:khachHangId')
  async findByKhachHang(@Param('khachHangId') khachHangId: string) {
    return this.service.findByKhachHang(khachHangId);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNhuCauDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateNhuCauDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}