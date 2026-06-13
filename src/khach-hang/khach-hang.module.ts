import { Module } from '@nestjs/common';
import { KhachHangController } from './khach-hang.controller';
import { KhachHangService } from './khach-hang.service';

@Module({
  controllers: [KhachHangController],
  providers: [KhachHangService],
})
export class KhachHangModule {}