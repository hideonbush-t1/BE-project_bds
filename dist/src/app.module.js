"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const bat_dong_san_module_1 = require("./bat-dong-san/bat-dong-san.module");
const giao_dich_module_1 = require("./giao-dich/giao-dich.module");
const khach_hang_module_1 = require("./khach-hang/khach-hang.module");
const nhan_vien_module_1 = require("./nhan-vien/nhan-vien.module");
const nhu_cau_module_1 = require("./nhu-cau/nhu-cau.module");
const public_api_module_1 = require("./public-api/public-api.module");
const prisma_module_1 = require("./prisma/prisma.module");
const thong_bao_module_1 = require("./thong-bao/thong-bao.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            nhan_vien_module_1.NhanVienModule,
            khach_hang_module_1.KhachHangModule,
            nhu_cau_module_1.NhuCauModule,
            bat_dong_san_module_1.BatDongSanModule,
            giao_dich_module_1.GiaoDichModule,
            thong_bao_module_1.ThongBaoModule,
            public_api_module_1.PublicApiModule,
        ],
        providers: [jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map