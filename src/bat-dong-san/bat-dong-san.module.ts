import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; // <-- Tích hợp thư viện Cache
import { BatDongSanController } from './bat-dong-san.controller';
import { BatDongSanService } from './bat-dong-san.service';

@Module({
  imports: [
    // TỐI ƯU HIỆU NĂNG: Bật Cache cho toàn bộ module này
    CacheModule.register({
      ttl: 60000, // Thời gian lưu nhớ kết quả là 60.000 mili-giây (60 giây)
    }),
  ],
  controllers: [BatDongSanController],
  providers: [BatDongSanService],
})
export class BatDongSanModule {}