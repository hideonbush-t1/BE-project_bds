import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ThongKeService } from './thong-ke.service';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('thong-ke')
export class ThongKeController {
  constructor(private readonly service: ThongKeService) {}

  @Get('chart')
  @Roles('admin')
  getChartData(@Query('year') year: string) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getChartData(y);
  }

  @Get('giao-dich')
  @Roles('admin')
  getTableData(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const m = month ? parseInt(month) : 0; // 0 = Lấy cả năm
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getTableData(m, y);
  }
  @Get('tong-quan-nam')
  @Roles('admin')
  getYearlySummary(@Query('year') year: string) {
    const y = year ? parseInt(year) : new Date().getFullYear();
    return this.service.getYearlySummary(y);
  }
}