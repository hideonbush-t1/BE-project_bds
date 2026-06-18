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
    // Tìm nhân viên trong DB
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: loginDto.maNV },
    });
    
    // Kiểm tra mật khẩu
    if (!user || !(await bcrypt.compare(loginDto.matKhau, user.matKhau))) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    // 1. Tạo token: Truyền đầy đủ 4 thuộc tính theo interface JwtPayload
    const payload: JwtPayload = { 
      sub: user.id, 
      maNV: user.id, // Giả định maNV trùng với id, nếu có cột riêng hãy sửa thành user.maNV
      hoTen: user.hoTen,
      Role: user.Role 
    };
    
    const access_token = this.jwtService.sign(payload);

    // 2. Trả về token và thông tin người dùng
    return {
      access_token,
      user: {
        id: user.id,
        maNV: user.id,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai,
        chucVu: user.chucVu,
        role: user.Role, // Trả thẳng giá trị từ DB ('admin' hoặc 'employee')
      }
    };
  }

  async profile(userId: string) {
    const user = await this.prisma.nhanVien.findUnique({
      where: { id: userId },
      select: {
        id: true,
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