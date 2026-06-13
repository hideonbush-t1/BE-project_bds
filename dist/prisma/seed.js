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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);
    await prisma.nhanVien.upsert({
        where: { id: 'admin' },
        update: {},
        create: {
            id: 'admin',
            hoTen: 'Quản trị hệ thống',
            diaChi: 'Hà Nội',
            gioiTinh: 'Nam',
            ngaySinh: new Date('1990-01-01'),
            chucVu: 'Admin',
            soDienThoai: '0900000000',
            email: 'admin@bds.local',
            matKhau: passwordHash,
            admin: '1',
            tenDangNhap: 'admin',
            anhDaiDien: null,
            isDeleted: false,
            ngayTao: new Date(),
        },
    });
    await prisma.nhanVien.upsert({
        where: { id: 'nv001' },
        update: {},
        create: {
            id: 'nv001',
            hoTen: 'Nhân viên kinh doanh 001',
            diaChi: 'Đà Nẵng',
            gioiTinh: 'Nam',
            ngaySinh: new Date('1995-05-05'),
            chucVu: 'Nhân viên',
            soDienThoai: '0911111111',
            email: 'nv001@bds.local',
            matKhau: passwordHash,
            admin: '0',
            tenDangNhap: 'nv001',
            anhDaiDien: null,
            isDeleted: false,
            ngayTao: new Date(),
        },
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map