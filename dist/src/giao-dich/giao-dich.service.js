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
exports.GiaoDichService = void 0;
const common_1 = require("@nestjs/common");
const prisma_crud_service_1 = require("../common/crud/prisma-crud.service");
const prisma_service_1 = require("../prisma/prisma.service");
let GiaoDichService = class GiaoDichService extends prisma_crud_service_1.PrismaCrudService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.whereKey = 'id';
    }
    get delegate() {
        return this.prisma.giaoDich;
    }
    create(data) {
        return this.prisma.giaoDich.create({
            data: {
                id: `GD${Date.now()}`.slice(0, 20),
                nhanVienId: data.nhanVienId,
                benMua: data.benMuaId,
                benBan: data.benBanId ?? null,
                batDongSanId: data.batDongSanId,
                soTien: data.soTien,
                ngayGD: new Date(data.ngayGD),
                tyLeHoaHong: data.tyLeHoaHong ?? 0,
                moTaGD: data.moTaGD ?? null,
                tinhTrang: data.tinhTrang,
                isDeleted: false,
                ngayTao: new Date(),
            },
        });
    }
    update(id, data) {
        return this.prisma.giaoDich.update({
            where: { id },
            data: {
                ...(data.nhanVienId ? { nhanVienId: data.nhanVienId } : {}),
                ...(data.benMuaId ? { benMua: data.benMuaId } : {}),
                ...(data.benBanId ? { benBan: data.benBanId } : {}),
                ...(data.batDongSanId ? { batDongSanId: data.batDongSanId } : {}),
                ...(data.soTien ? { soTien: data.soTien } : {}),
                ...(data.ngayGD ? { ngayGD: new Date(data.ngayGD) } : {}),
                ...(data.tyLeHoaHong !== undefined ? { tyLeHoaHong: data.tyLeHoaHong } : {}),
                ...(data.moTaGD ? { moTaGD: data.moTaGD } : {}),
                ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}),
            },
        });
    }
};
exports.GiaoDichService = GiaoDichService;
exports.GiaoDichService = GiaoDichService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GiaoDichService);
//# sourceMappingURL=giao-dich.service.js.map