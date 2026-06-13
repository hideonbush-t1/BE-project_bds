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
exports.NhanVienService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_crud_service_1 = require("../common/crud/prisma-crud.service");
let NhanVienService = class NhanVienService extends prisma_crud_service_1.PrismaCrudService {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.whereKey = 'id';
    }
    get delegate() {
        return this.prisma.nhanVien;
    }
    async create(data) {
        return this.prisma.nhanVien.create({
            data: {
                id: data.maNV,
                hoTen: data.hoTen,
                diaChi: '',
                gioiTinh: 'Khac',
                ngaySinh: new Date('2000-01-01'),
                chucVu: data.chucVu,
                soDienThoai: data.soDienThoai ?? '',
                email: data.email,
                admin: data.isAdmin ? '1' : '0',
                tenDangNhap: data.maNV,
                anhDaiDien: null,
                isDeleted: false,
                ngayTao: new Date(),
                matKhau: await bcrypt.hash(data.matKhau, 10),
            },
        });
    }
    async update(id, data) {
        const payload = {
            ...(data.maNV ? { id: data.maNV } : {}),
            ...(data.hoTen ? { hoTen: data.hoTen } : {}),
            ...(data.email ? { email: data.email } : {}),
            ...(data.soDienThoai ? { soDienThoai: data.soDienThoai } : {}),
            ...(data.chucVu ? { chucVu: data.chucVu } : {}),
            ...(typeof data.isAdmin === 'boolean' ? { admin: data.isAdmin ? '1' : '0' } : {}),
        };
        if (data.matKhau) {
            payload.matKhau = await bcrypt.hash(data.matKhau, 10);
        }
        return this.prisma.nhanVien.update({ where: { id }, data: payload });
    }
};
exports.NhanVienService = NhanVienService;
exports.NhanVienService = NhanVienService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NhanVienService);
//# sourceMappingURL=nhan-vien.service.js.map