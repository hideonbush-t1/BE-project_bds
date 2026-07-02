import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
    // 1. Tìm user từ database để lấy thông tin mới nhất
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        hoTen: true,
        Role: true, // Lấy role chính xác từ DB
      },
    });

    // 2. Nếu user không tồn tại, trả về payload gốc (để giữ logic bảo mật)
    if (!user) {
      return payload;
    }

    // 3. Trả về đúng cấu trúc để gắn vào request.user
    // Các Controller sau này sẽ truy cập được thông qua: request.user.Role, request.user.hoTen...
    return {
      id: user.id,         // Dùng cho sub
      sub: user.id,
      maNV: user.id,      // Giả định dùng ID làm mã nhân viên
      hoTen: user.hoTen,
      Role: user.Role,    // Giá trị 'admin' hoặc 'employee' từ DB
    };
  }
}