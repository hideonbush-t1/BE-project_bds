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
exports.BatDongSanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_crud_service_1 = require("../common/crud/prisma-crud.service");
const prisma_service_1 = require("../prisma/prisma.service");
let BatDongSanService = class BatDongSanService extends prisma_crud_service_1.PrismaCrudService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.whereKey = 'id';
    }
    get delegate() {
        return this.prisma.batDongSan;
    }
    create(data) {
        const { huong, moTa, ...batDongSanData } = data;
        const propertyId = `BDS${Date.now()}`.slice(0, 20);
        return this.prisma.batDongSan.create({
            data: {
                id: propertyId,
                khachHangId: batDongSanData.khachHangId,
                nhuCau: batDongSanData.nhuCau ?? null,
                tieuDe: batDongSanData.tieuDe,
                loaiBDS: batDongSanData.loaiBDS,
                diaChi: batDongSanData.diaChi,
                dienTich: batDongSanData.dienTich,
                giaTien: batDongSanData.giaTien,
                tinhTrang: batDongSanData.tinhTrang,
                isDeleted: false,
                ngayTao: new Date(),
                viTri: null,
                huong: huong ?? null,
                ghiChu: moTa ?? null,
                chiTiet: huong || moTa ? { create: { huong, moTa } } : undefined,
            },
        });
    }
    update(id, data) {
        return this.prisma.batDongSan.update({
            where: { id },
            data: {
                ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
                ...(data.tieuDe ? { tieuDe: data.tieuDe } : {}),
                ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
                ...(data.diaChi ? { diaChi: data.diaChi } : {}),
                ...(data.dienTich !== undefined ? { dienTich: data.dienTich } : {}),
                ...(data.giaTien ? { giaTien: data.giaTien } : {}),
                ...(data.nhuCau ? { nhuCau: data.nhuCau } : {}),
                ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}),
            },
        });
    }
};
exports.BatDongSanService = BatDongSanService;
exports.BatDongSanService = BatDongSanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatDongSanService);
//# sourceMappingURL=bat-dong-san.service.js.map