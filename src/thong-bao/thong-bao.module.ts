import { Module } from '@nestjs/common';
import { ThongBaoController } from './thong-bao.controller';
import { ThongBaoService } from './thong-bao.service';

@Module({
  controllers: [ThongBaoController],
  providers: [ThongBaoService],
})
export class ThongBaoModule {}