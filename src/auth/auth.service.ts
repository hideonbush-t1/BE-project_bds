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
    // Tìm nhân viên theo cột tenDangNhap thay vì id
    const user = await this.prisma.nhanVien.findFirst({
      where: { tenDangNhap: loginDto.maNV },
    });
    
    if (!user || !(await bcrypt.compare(loginDto.matKhau, user.matKhau))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    return {
      // Trả về cả user để Frontend biết role mà điều hướng
      user: {
          id: user.id,
          maNV: user.tenDangNhap,
          hoTen: user.hoTen,
          email: user.email,
          chucVu: user.chucVu,
          role: user.Role // SỬA Ở ĐÂY: Dùng chữ R viết hoa
      },
      access_token: this.jwtService.sign({ 
        sub: user.id, 
        role: user.Role // SỬA Ở ĐÂY: Dùng chữ R viết hoa
      }),
    };
  }

  profile(userId: string) {
    return this.prisma.nhanVien.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tenDangNhap: true, 
        hoTen: true,
        email: true,
        soDienThoai: true,
        chucVu: true,
        Role: true, // SỬA Ở ĐÂY: Dùng chữ R viết hoa
      },
    }).then((user) =>
      user
        ? {
            id: user.id,
            maNV: user.tenDangNhap, 
            hoTen: user.hoTen,
            email: user.email,
            soDienThoai: user.soDienThoai,
            chucVu: user.chucVu,
            role: user.Role, // SỬA Ở ĐÂY: Dùng chữ R viết hoa
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