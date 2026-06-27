import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BatDongSanModule } from './bat-dong-san/bat-dong-san.module';
import { GiaoDichModule } from './giao-dich/giao-dich.module';
import { KhachHangModule } from './khach-hang/khach-hang.module';
import { NhanVienModule } from './nhan-vien/nhan-vien.module';
import { PublicApiModule } from './public-api/public-api.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThongBaoModule } from './thong-bao/thong-bao.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { BieuMauModule } from './bieu-mau/bieu-mau.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    NhanVienModule,
    KhachHangModule,
    BatDongSanModule,
    GiaoDichModule,
    ThongBaoModule,
    PublicApiModule,
    BieuMauModule,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AppModule {}