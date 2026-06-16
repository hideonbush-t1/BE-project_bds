import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
import { KhachHangService } from './khach-hang.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'employee')
@Controller('khach-hang')
export class KhachHangController {
  constructor(private readonly service: KhachHangService) {}

  /**
   * SRS 5.5.1: Xem danh sách khách hàng
   */
  @Get()
  findAll(@Query() query: { loaiKH?: string; search?: string }) {
    return this.service.findAll(query);
  }

  /**
   * SRS 5.5.3: Xem thông tin chi tiết khách hàng
   */
  @Get(':MaKH')
  findOne(@Param('MaKH') MaKH: string) {
    return this.service.findOne(MaKH); // Gọi đến hàm findOne(string) đã override ở Service
  }

  /**
   * SRS 5.5.2: Thêm mới khách hàng
   */
  @Post()
  create(@Body() dto: CreateKhachHangDto) {
    return this.service.create(dto);
  }

  /**
   * SRS 5.5.3: Chỉnh sửa thông tin khách hàng
   */
  @Patch(':MaKH')
  update(@Param('MaKH') MaKH: string, @Body() dto: UpdateKhachHangDto) {
    return this.service.update(MaKH, dto);
  }

  /**
   * SRS 5.5.3: Xóa khách hàng
   */
  @Delete(':MaKH')
  remove(@Param('MaKH') MaKH: string) {
    return this.service.remove(MaKH); // Gọi đến hàm remove(string) đã override ở Service
  }

  /**
   * SRS 5.5.4: Xem danh sách Nhu cầu của riêng một khách hàng
   */
  @Get(':MaKH/nhu-cau')
  findNhuCauByKhachHang(@Param('MaKH') MaKH: string) {
    return this.service.findNhuCauByKhachHang(MaKH);
  }

  /**
   * SRS 5.5.5: Xem danh sách Bất động sản sở hữu của riêng một khách hàng
   */
  @Get(':MaKH/bat-dong-san')
  findBatDongSanByKhachHang(@Param('MaKH') MaKH: string) {
    return this.service.findBatDongSanByKhachHang(MaKH);
  }
}