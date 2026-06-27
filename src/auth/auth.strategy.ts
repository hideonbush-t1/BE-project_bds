import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // Lấy token từ header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Đảm bảo JWT_SECRET trong .env trùng với secret khi ký token ở AuthService
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'change-this-secret',
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`🔍 [Backend] Payload nhận được: ${JSON.stringify(payload)}`);

    // 1. Tìm user từ database
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        tenDangNhap: true,
        hoTen: true,
        Role: true,
      },
    });

    // 2. Nếu không tìm thấy user hoặc token lỗi
    if (!user) {
      this.logger.warn(`❌ [Backend] Không tìm thấy user với ID: ${payload.sub}`);
      throw new UnauthorizedException('Token không hợp lệ hoặc người dùng không tồn tại');
    }

    this.logger.log(`✅ [Backend] User đã xác thực thành công: ${user.tenDangNhap}`);

    // 3. Trả về thông tin gắn vào request.user
    return {
      id: user.id,
      sub: user.id,
      maNV: user.id,
      hoTen: user.hoTen,
      Role: user.Role, 
    };
  }
}