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
    // 1. Tìm nhân viên trong DB
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: loginDto.maNV },
    });
    
    // 2. Kiểm tra tồn tại và xác thực mật khẩu
    if (!user || !(await bcrypt.compare(loginDto.matKhau, user.matKhau))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    // 3. Tạo Payload cho Token (Đảm bảo Role viết hoa khớp với interface)
    const payload: JwtPayload = { 
      sub: user.id, 
      maNV: user.id, 
      hoTen: user.hoTen,
      Role: user.Role 
    };
    
    // 4. Trả về token và thông tin người dùng
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        maNV: user.id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        chucVu: user.chucVu,
        role: user.Role, // Giá trị trả về cho Frontend
      }
    };
  }

  async profile(userId: string) {
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tenDangNhap: true, 
        hoTen: true,
        email: true,
        soDienThoai: true,
        chucVu: true,
        Role: true, 
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      maNV: user.id,
      hoTen: user.hoTen,
      email: user.email,
      soDienThoai: user.soDienThoai,
      chucVu: user.chucVu,
      role: user.Role, 
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.nhanVien.findUnique({ 
      where: { id: userId } 
    });

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