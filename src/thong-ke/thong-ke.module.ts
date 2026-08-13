import { Module } from '@nestjs/common';
import { ThongKeController } from './thong-ke.controller';
import { ThongKeService } from './thong-ke.service';
// Import PrismaModule để ThongKeService có thể gọi database
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [ThongKeController],
  providers: [ThongKeService],
})
export class ThongKeModule {}