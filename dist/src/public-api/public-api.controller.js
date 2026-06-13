"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicApiController = class PublicApiController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findProperties() {
        return this.prisma.batDongSan.findMany({
            orderBy: { ngayTao: 'desc' },
            include: {
                chiTiet: true,
                hinhAnhs: true,
                khachHang: true,
            },
        });
    }
    findNotifications() {
        return this.prisma.thongBao.findMany({
            orderBy: { ngayDang: 'desc' },
            include: { nhanVien: true },
        });
    }
    findForms() {
        return this.prisma.thongBao.findMany({
            orderBy: { ngayDang: 'desc' },
            take: 10,
            include: { nhanVien: true },
        });
    }
    register(body) {
        return this.prisma.khachHang.create({
            data: {
                id: `KH${Date.now()}`.slice(0, 20),
                loaiKH: 'Khach hang',
                hoTen: body.hoTen,
                email: body.email,
                soDienThoai: body.soDienThoai ?? '',
                diaChi: body.diaChi ?? '',
                gioiTinh: 'Khac',
                ngaySinh: new Date('2000-01-01'),
                nhanVienId: null,
                isDeleted: false,
                ngayTao: new Date(),
                soCMND: null,
            },
        });
    }
};
exports.PublicApiController = PublicApiController;
__decorate([
    (0, common_1.Get)('bat-dong-san'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicApiController.prototype, "findProperties", null);
__decorate([
    (0, common_1.Get)('thong-bao'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicApiController.prototype, "findNotifications", null);
__decorate([
    (0, common_1.Get)('ho-so-bieu-mau'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicApiController.prototype, "findForms", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PublicApiController.prototype, "register", null);
exports.PublicApiController = PublicApiController = __decorate([
    (0, common_1.Controller)('public'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicApiController);
//# sourceMappingURL=public-api.controller.js.map