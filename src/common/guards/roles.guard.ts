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
      console.log('RolesGuard: User hoặc Role bị thiếu');
      return false;
    }

    // 3. Chuẩn hóa để so sánh (không phân biệt hoa/thường)
    const userRole = user.role.toLowerCase();

    // 4. Kiểm tra quyền
    // Logic: Nếu role trong Controller nằm trong danh sách quyền của User thì cho qua
    const hasRole = requiredRoles.some((role) => {
      const r = role.toLowerCase();
      
      // Nếu là admin, khớp chính xác với 'admin'
      if (r === 'admin') return userRole === 'admin';
      
      // Nếu là employee, khớp với 'employee' hoặc 'nhanvien'
      if (r === 'employee') return userRole === 'nhanvien' || userRole === 'employee';
      
      return r === userRole;
    });

    if (!hasRole) {
      console.log(`RolesGuard: Từ chối truy cập. User role: ${userRole}, Yêu cầu: ${requiredRoles}`);
    }

    return hasRole;
  }
}