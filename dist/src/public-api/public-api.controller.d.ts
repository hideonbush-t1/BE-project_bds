import { PrismaService } from '../prisma/prisma.service';
export declare class PublicApiController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findProperties(): import(".prisma/client").Prisma.PrismaPromise<({
        khachHang: {
            id: string;
            diaChi: string;
            isDeleted: boolean | null;
            ngayTao: Date | null;
            loaiKH: string;
            hoTen: string;
            gioiTinh: string;
            ngaySinh: Date;
            soDienThoai: string;
            email: string | null;
            nhanVienId: string | null;
            soCMND: string | null;
        };
        chiTiet: {
            id: string;
            viTri: string | null;
            huong: string | null;
            ghiChu: string | null;
            soPhongNgu: number | null;
            soToilet: number | null;
            soTang: number | null;
            matTien: number | null;
            duongVao: number | null;
            phapLy: string | null;
            moTa: string | null;
        } | null;
        hinhAnhs: {
            id: number;
            batDongSanId: string;
            duongDan: string;
            anhDaiDien: boolean | null;
        }[];
    } & {
        id: string;
        khachHangId: string;
        nhuCau: string | null;
        tieuDe: string | null;
        loaiBDS: string;
        diaChi: string;
        dienTich: number;
        giaTien: import("@prisma/client/runtime/library").Decimal;
        tinhTrang: string;
        isDeleted: boolean | null;
        ngayTao: Date | null;
        ngayCapNhat: Date | null;
        viTri: string | null;
        huong: string | null;
        ghiChu: string | null;
    })[]>;
    findNotifications(): import(".prisma/client").Prisma.PrismaPromise<({
        nhanVien: {
            id: string;
            diaChi: string;
            isDeleted: boolean | null;
            ngayTao: Date | null;
            hoTen: string;
            gioiTinh: string;
            ngaySinh: Date;
            soDienThoai: string;
            email: string;
            anhDaiDien: string | null;
            matKhau: string;
            chucVu: string;
            admin: string;
            tenDangNhap: string | null;
        } | null;
    } & {
        id: number;
        tieuDe: string;
        isDeleted: boolean | null;
        nhanVienId: string | null;
        noiDung: string;
        ngayDang: Date;
    })[]>;
    findForms(): import(".prisma/client").Prisma.PrismaPromise<({
        nhanVien: {
            id: string;
            diaChi: string;
            isDeleted: boolean | null;
            ngayTao: Date | null;
            hoTen: string;
            gioiTinh: string;
            ngaySinh: Date;
            soDienThoai: string;
            email: string;
            anhDaiDien: string | null;
            matKhau: string;
            chucVu: string;
            admin: string;
            tenDangNhap: string | null;
        } | null;
    } & {
        id: number;
        tieuDe: string;
        isDeleted: boolean | null;
        nhanVienId: string | null;
        noiDung: string;
        ngayDang: Date;
    })[]>;
    register(body: {
        hoTen: string;
        email?: string;
        soDienThoai?: string;
        diaChi?: string;
    }): import(".prisma/client").Prisma.Prisma__KhachHangClient<{
        id: string;
        diaChi: string;
        isDeleted: boolean | null;
        ngayTao: Date | null;
        loaiKH: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: Date;
        soDienThoai: string;
        email: string | null;
        nhanVienId: string | null;
        soCMND: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
