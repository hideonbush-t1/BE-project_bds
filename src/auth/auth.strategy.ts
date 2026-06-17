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
    // Tìm user từ database để lấy role mới nhất
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        tenDangNhap: true, // Bổ sung để lấy maNV chuẩn xác
        hoTen: true,
        Role: true, // SỬA Ở ĐÂY: Dùng chữ R viết hoa
      },
    });

    // Nếu không tìm thấy trong DB, vẫn trả về payload gốc từ token để không bị chặn oan
    if (!user) {
      return payload;
    }

    // Trả về đúng cấu trúc mà RolesGuard mong đợi
    return {
      sub: user.id,
      maNV: user.tenDangNhap, // SỬA: lấy từ tenDangNhap thay vì id
      hoTen: user.hoTen,
      role: user.Role, // SỬA Ở ĐÂY: Dùng chữ R viết hoa
    };
  }
}