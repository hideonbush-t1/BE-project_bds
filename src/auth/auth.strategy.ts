import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'change-this-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        hoTen: true,
        email: true,
        soDienThoai: true,
        chucVu: true,
        role: true, // Thay 'admin' bằng 'role'
      },
    });

    if (!user) {
      return payload;
    }

    return {
      sub: user.id,
      maNV: user.id,
      hoTen: user.hoTen,
      // Logic kiểm tra quyền dựa trên chuỗi 'admin' từ Database
      isAdmin: user.role === 'admin',
    };
  }
}