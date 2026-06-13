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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhachHangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_crud_service_1 = require("../common/crud/prisma-crud.service");
const prisma_service_1 = require("../prisma/prisma.service");
let KhachHangService = class KhachHangService extends prisma_crud_service_1.PrismaCrudService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.whereKey = 'id';
    }
    get delegate() {
        return this.prisma.khachHang;
    }
    create(data) {
        return this.prisma.khachHang.create({
            data: {
                id: data.maKH,
                loaiKH: data.loaiKH,
                hoTen: data.hoTen,
                gioiTinh: data.gioiTinh ?? 'Khac',
                ngaySinh: data.ngaySinh ? new Date(data.ngaySinh) : new Date('2000-01-01'),
                diaChi: data.diaChi ?? '',
                soDienThoai: data.soDienThoai ?? '',
                email: data.email,
                nhanVienId: null,
                isDeleted: false,
                ngayTao: new Date(),
                soCMND: null,
            },
        });
    }
    update(id, data) {
        return this.prisma.khachHang.update({
            where: { id },
            data: {
                ...(data.maKH ? { id: data.maKH } : {}),
                ...(data.loaiKH ? { loaiKH: data.loaiKH } : {}),
                ...(data.hoTen ? { hoTen: data.hoTen } : {}),
                ...(data.gioiTinh ? { gioiTinh: data.gioiTinh } : {}),
                ...(data.ngaySinh ? { ngaySinh: new Date(data.ngaySinh) } : {}),
                ...(data.diaChi ? { diaChi: data.diaChi } : {}),
                ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
                ...(data.email ? { email: data.email } : {}),
            },
        });
    }
};
exports.KhachHangService = KhachHangService;
exports.KhachHangService = KhachHangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KhachHangService);
//# sourceMappingURL=khach-hang.service.js.map