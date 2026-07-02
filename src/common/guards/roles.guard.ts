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

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    // Kiểm tra user có tồn tại và có role không
    if (!user || !user.Role) {
      console.log('RolesGuard: User hoặc Role bị thiếu');
      return false;
    }

    // Lấy role từ Token (đã là 'admin' hoặc 'employee')
    const userRole = String(user.Role).toLowerCase().trim();

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