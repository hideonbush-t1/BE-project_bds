import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateGiaoDichDto } from './dto/create-giao-dich.dto';
import { UpdateGiaoDichDto } from './dto/update-giao-dich.dto';
import { GiaoDichService } from './giao-dich.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('giao-dich')
export class GiaoDichController {
  constructor(private readonly service: GiaoDichService) {}

  @Get()
  findAll() {
    return this.service.findAll();
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}