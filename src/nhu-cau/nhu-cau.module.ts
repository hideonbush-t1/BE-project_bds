import { Module } from '@nestjs/common';
import { NhuCauController } from './nhu-cau.controller';
import { NhuCauService } from './nhu-cau.service';

@Module({
  controllers: [NhuCauController],
  providers: [NhuCauService],
})
export class NhuCauModule {}