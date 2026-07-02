import { Module } from '@nestjs/common';
import { GiaoDichController } from './giao-dich.controller';
import { GiaoDichService } from './giao-dich.service';

@Module({
  controllers: [GiaoDichController],
  providers: [GiaoDichService],
})
export class GiaoDichModule {}