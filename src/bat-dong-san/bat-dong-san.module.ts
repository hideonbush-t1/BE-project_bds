import { Module } from '@nestjs/common';
import { BatDongSanController } from './bat-dong-san.controller';
import { BatDongSanService } from './bat-dong-san.service';

@Module({
  controllers: [BatDongSanController],
  providers: [BatDongSanService],
})
export class BatDongSanModule {}