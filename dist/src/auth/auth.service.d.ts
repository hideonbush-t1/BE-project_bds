import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
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
    profile(userId: string): Promise<{
        id: string;
        maNV: string;
        hoTen: string;
        email: string;
        soDienThoai: string;
        chucVu: string;
        isAdmin: boolean;
    } | null>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
