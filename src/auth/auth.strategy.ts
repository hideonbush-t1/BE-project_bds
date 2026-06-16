import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { // Đã thêm tên 'jwt'
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
    // Tìm user từ database để lấy role mới nhất
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        hoTen: true,
        role: true, // Lấy role chính xác từ DB
      },
    });

    // Nếu không tìm thấy trong DB, vẫn trả về payload gốc từ token để không bị chặn oan
    if (!user) {
      return payload;
    }

    // Trả về đúng cấu trúc mà RolesGuard mong đợi
    return {
      sub: user.id,
      maNV: user.id,
      hoTen: user.hoTen,
      role: user.role, // BẮT BUỘC phải có trường này
    };
  }
}