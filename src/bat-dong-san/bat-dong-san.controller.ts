import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  create(@Body() dto: CreateBatDongSanDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBatDongSanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
