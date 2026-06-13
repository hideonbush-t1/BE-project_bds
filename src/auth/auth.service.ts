import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: loginDto.maNV },
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.matKhau, user.matKhau);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    const payload: JwtPayload = {
      sub: user.id,
      maNV: user.id,
      hoTen: user.hoTen,
      isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') ?? 'change-this-secret',
      }),
      user: {
        id: user.id,
        maNV: user.id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        chucVu: user.chucVu,
        isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
      },
    };
  }

  profile(userId: string) {
    return this.prisma.nhanVien.findUnique({
      where: { id: userId },
      select: {
        id: true,
        hoTen: true,
        email: true,
        soDienThoai: true,
        chucVu: true,
        admin: true,
      },
    }).then((user) =>
      user
        ? {
            id: user.id,
            maNV: user.id,
            hoTen: user.hoTen,
            email: user.email,
            soDienThoai: user.soDienThoai,
            chucVu: user.chucVu,
            isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
          }
        : null,
    );
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.nhanVien.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const currentPasswordValid = await bcrypt.compare(dto.currentPassword, user.matKhau);
    if (!currentPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.nhanVien.update({
      where: { id: userId },
      data: { matKhau: hashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}