import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { BatDongSanService } from './bat-dong-san.service';

// KHÔNG có @UseGuards(JwtAuthGuard, RolesGuard) ở đây
@Controller('public/bat-dong-san')
export class BatDongSanPublicController {
  constructor(private readonly service: BatDongSanService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  @UseInterceptors(CacheInterceptor)
  search(
    @Query('loaiBDS') loaiBDS?: string,
    @Query('viTri') viTri?: string,
    @Query('diaChi') diaChi?: string,
    @Query('giaMin') giaMin?: string,
    @Query('giaMax') giaMax?: string,
    @Query('huong') huong?: string,
  ) {
    const parsedGiaMin = giaMin ? Number(giaMin) : undefined;
    const parsedGiaMax = giaMax ? Number(giaMax) : undefined;
    return this.service.search(loaiBDS, viTri, diaChi, parsedGiaMin, parsedGiaMax, huong);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}