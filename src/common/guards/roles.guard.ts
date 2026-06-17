import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RoleType } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách quyền yêu cầu từ Controller/Handler
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không yêu cầu quyền đặc biệt, cho phép truy cập
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. Lấy thông tin user từ request (đã được JwtAuthGuard điền vào)
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    // Nếu không có user hoặc user không có role -> Chặn
    if (!user || !user.role) {
      console.log('RolesGuard: User hoặc Role bị thiếu trong Token');
      return false;
    }

    // 3. Chuẩn hóa giá trị role từ Token
    // Ánh xạ giá trị '1' từ DB/JWT thành 'admin' để khớp với logic Controller
    let userRole = String(user.role).toLowerCase();
    if (userRole === '1') {
      userRole = 'admin';
    }

    // 4. Kiểm tra quyền
    const hasRole = requiredRoles.some((role) => {
      const r = role.toLowerCase();
      
      // So sánh quyền yêu cầu với role đã được chuẩn hóa
      if (r === 'admin') return userRole === 'admin';
      if (r === 'employee') return userRole === 'nhanvien' || userRole === 'employee';
      
      return r === userRole;
    });

    if (!hasRole) {
      console.log(`RolesGuard: Từ chối truy cập. Role thực tế: ${userRole}, Yêu cầu: ${requiredRoles}`);
    }

    return hasRole;
  }
}