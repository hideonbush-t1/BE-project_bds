import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // Import Module quản lý Prisma của nhóm
import { KhachHangController } from './khach-hang.controller';
import { KhachHangService } from './khach-hang.service';

@Module({
  imports: [
    PrismaModule // Cung cấp PrismaService cho KhachHangService sử dụng các hàm findMany, create, update
  ],
  controllers: [KhachHangController],
  providers: [KhachHangService],
  exports: [KhachHangService], // Xuất ra ngoài nếu các module khác (như NhuCauModule) cần gọi đến kiểm tra thông tin khách hàng
})
export class KhachHangModule {}