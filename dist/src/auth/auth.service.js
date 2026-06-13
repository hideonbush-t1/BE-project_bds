"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const user = await this.prisma.nhanVien.findUnique({
            where: { id: loginDto.maNV },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.matKhau, user.matKhau);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        const payload = {
            sub: user.id,
            maNV: user.id,
            hoTen: user.hoTen,
            isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
        };
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET') ?? 'change-this-secret',
            }),
            user: {
                id: user.id,
                maNV: user.id,
                hoTen: user.hoTen,
                email: user.email,
                soDienThoai: user.soDienThoai,
                chucVu: user.chucVu,
                isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
            },
        };
    }
    profile(userId) {
        return this.prisma.nhanVien.findUnique({
            where: { id: userId },
            select: {
                id: true,
                hoTen: true,
                email: true,
                soDienThoai: true,
                chucVu: true,
                admin: true,
            },
        }).then((user) => user
            ? {
                id: user.id,
                maNV: user.id,
                hoTen: user.hoTen,
                email: user.email,
                soDienThoai: user.soDienThoai,
                chucVu: user.chucVu,
                isAdmin: user.admin === '1' || user.admin.toLowerCase() === 'true',
            }
            : null);
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.nhanVien.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        const currentPasswordValid = await bcrypt.compare(dto.currentPassword, user.matKhau);
        if (!currentPasswordValid) {
            throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.nhanVien.update({
            where: { id: userId },
            data: { matKhau: hashedPassword },
        });
        return { message: 'Đổi mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map