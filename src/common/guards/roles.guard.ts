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

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    // Nếu không có user đăng nhập hoặc user không có role
    if (!user || !user.role) {
      return false;
    }

    // Chuẩn hóa role trong DB thành chữ thường để so sánh không bị lỗi phân biệt hoa/thường
    const userRole = user.role.toLowerCase();

    // 1. Nếu Route yêu cầu quyền 'admin', chỉ cho phép user có role là 'admin'
    if (requiredRoles.includes('admin' as RoleType) && userRole === 'admin') {
      return true;
    }

    // 2. Nếu Route yêu cầu quyền 'employee', 
    // Giả sử trong DB nhân viên thường bạn lưu là "NhanVien" hoặc "Employee"
    if (requiredRoles.includes('employee' as RoleType) && (userRole === 'nhanvien' || userRole === 'employee')) {
      return true;
    }

    // (Tùy chọn) 3. Mở rộng thêm quyền dễ dàng sau này
    // if (requiredRoles.includes('manager' as RoleType) && userRole === 'manager') { ... }

    return false;
  }
}