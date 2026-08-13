import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ThongKeService } from './thong-ke.service';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // 🔒 TỐI ƯU: Gắn thẳng 'admin' lên đây để KHÓA TOÀN BỘ file này
@Controller('thong-ke')
export class ThongKeController {
  constructor(private readonly service: ThongKeService) {}

  @Get('tong-quan-nam')
  @Roles('admin')
  getYearlySummary(
    @Query('year') year: string,
    @Query('period') period?: string,
    @Query('nhanVienId') nhanVienId?: string
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getYearlySummary(y, period, nhanVienId);
  }

  @Get('chart')
  @Roles('admin')
  getChartData(
    @Query('year') year: string,
    @Query('period') period?: string,
    @Query('nhanVienId') nhanVienId?: string
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getChartData(y, period, nhanVienId);
  }

  @Get('giao-dich')
  @Roles('admin')
  getTableData(
    @Query('year') year: string,
    @Query('period') period?: string,
    @Query('nhanVienId') nhanVienId?: string
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getTableData(y, period, nhanVienId);
  }

  // 👇 THÊM MỚI: Endpoint Top Nhân viên
  @Get('top-nhan-vien')
  @Roles('admin')
  getTopNhanVien(
    @Query('year') year: string,
    @Query('period') period?: string,
    @Query('limit') limit?: string
  ) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    const l = limit ? parseInt(limit) : 10; // Mặc định lấy Top 10
    return this.service.getTopNhanVien(y, period, l);
  }
}