import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
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

    // Nếu API không gắn @Roles() thì ai cũng vào được (Miễn là có token)
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload & { role?: string, Role?: string } }>();
    const user = request.user;

    // 💡 TỐI ƯU 1: Bắn lỗi rõ ràng nếu mất quyền / mất token
    if (!user || (!user.Role && !user.role)) {
      console.error('RolesGuard: User hoặc Role bị thiếu. Dữ liệu user:', user);
      throw new UnauthorizedException('Không tìm thấy quyền hạn của bạn. Vui lòng đăng nhập lại!');
    }

    const userRole = String(user.Role || user.role).toLowerCase().trim();

    const hasRole = requiredRoles.some((role) => {
      if (userRole === 'admin') return true; // Admin được cấp quyền tối thượng (God Mode)
      return role.toLowerCase() === userRole;
    });

    // 💡 TỐI ƯU 2: Quăng lỗi 403 tiếng Việt nếu vi phạm
    if (!hasRole) {
      console.warn(`RolesGuard: Từ chối truy cập. Role thực tế: ${userRole}, Yêu cầu: ${requiredRoles}`);
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này!');
    }

    return true;
  }
}