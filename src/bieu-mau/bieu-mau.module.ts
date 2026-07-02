import { Module } from '@nestjs/common';
import { BieuMauController } from './bieu-mau.controller';
import { BieuMauService } from './bieu-mau.service';

@Module({
  controllers: [BieuMauController],
  providers: [BieuMauService],
})
export class BieuMauModule {}