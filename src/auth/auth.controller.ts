import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard'; // 💡 Import thêm RolesGuard
import { Roles } from '../common/decorators/roles.decorator'; // 💡 Import thêm Roles
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🔓 Public API: Mở cửa hoàn toàn để đăng nhập
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 🔒 Protected API: Chỉ người có token hợp lệ VÀ có quyền mới được đổi pass
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employee') // 💡 Vì Admin là "Chúa tể" (God Mode) nên chỉ cần khai báo 'employee' là cả 2 đều vào được
  @Post('change-password')
  changePassword(@Req() req: { user: { sub: string } }, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  // 🔒 Protected API: Xem thông tin cá nhân
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employee') // 💡 Tương tự, cấp quyền cơ bản, Admin tự động pass
  @Get('profile')
  profile(@Req() req: { user: { sub: string } }) {
    return this.authService.profile(req.user.sub);
  }
}