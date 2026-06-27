import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RoleType } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload & { role?: string } }>();
    const user = request.user;

    // 💡 ĐÃ SỬA: Bắt cả Role (hoa) và role (thường)
    if (!user || (!user.Role && !user.role)) {
      console.log('RolesGuard: User hoặc Role bị thiếu. Dữ liệu user:', user);
      return false;
    }

    // 💡 ĐÃ SỬA: Gom dữ liệu linh hoạt
    const userRole = String(user.Role || user.role).toLowerCase().trim();

    // Kiểm tra quyền: Admin được vào mọi nơi, còn lại phải khớp
    const hasRole = requiredRoles.some((role) => {
      if (userRole === 'admin') return true; // Admin là "chúa tể"
      return role.toLowerCase() === userRole;
    });

    if (!hasRole) {
      console.log(`RolesGuard: Từ chối truy cập. Role thực tế: ${userRole}, Yêu cầu: ${requiredRoles}`);
    }

    return hasRole;
  }
}