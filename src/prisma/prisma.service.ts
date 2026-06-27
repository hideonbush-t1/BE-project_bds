import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Phương thức này tự động chạy khi module Prisma được khởi tạo
  async onModuleInit() {
    await this.$connect();
  }

  // Phương thức này giúp đóng kết nối database sạch sẽ khi ứng dụng NestJS dừng lại
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}