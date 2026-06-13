import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            maNV: string;
            hoTen: string;
            email: string;
            soDienThoai: string;
            chucVu: string;
            isAdmin: boolean;
        };
    }>;
    changePassword(req: {
        user: {
            sub: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    profile(req: {
        user: {
            sub: string;
        };
    }): Promise<{
        id: string;
        maNV: string;
        hoTen: string;
        email: string;
        soDienThoai: string;
        chucVu: string;
        isAdmin: boolean;
    } | null>;
}
