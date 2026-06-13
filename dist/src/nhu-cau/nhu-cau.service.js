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
exports.NhuCauService = void 0;
const common_1 = require("@nestjs/common");
const prisma_crud_service_1 = require("../common/crud/prisma-crud.service");
const prisma_service_1 = require("../prisma/prisma.service");
let NhuCauService = class NhuCauService extends prisma_crud_service_1.PrismaCrudService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.whereKey = 'id';
    }
    get delegate() {
        return this.prisma.nhuCau;
    }
    create(data) {
        return this.prisma.nhuCau.create({
            data: {
                id: `NC${Date.now()}`.slice(0, 20),
                khachHangId: data.khachHangId,
                loaiNC: data.loaiNhuCau,
                loaiBDS: data.loaiBDS,
                viTri: data.viTri,
                dienTichMin: data.dienTichMin,
                dienTichMax: data.dienTichMax,
                ghiChu: data.ghiChu,
                isDeleted: false,
            },
        });
    }
    update(id, data) {
        return this.prisma.nhuCau.update({
            where: { id },
            data: {
                ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
                ...(data.loaiNhuCau ? { loaiNC: data.loaiNhuCau } : {}),
                ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
                ...(data.viTri ? { viTri: data.viTri } : {}),
                ...(data.dienTichMin !== undefined ? { dienTichMin: data.dienTichMin } : {}),
                ...(data.dienTichMax !== undefined ? { dienTichMax: data.dienTichMax } : {}),
                ...(data.ghiChu ? { ghiChu: data.ghiChu } : {}),
            },
        });
    }
};
exports.NhuCauService = NhuCauService;
exports.NhuCauService = NhuCauService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NhuCauService);
//# sourceMappingURL=nhu-cau.service.js.map