import { PrismaService } from '../prisma/prisma.service';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto';
import { UpdateNhanVienDto } from './dto/update-nhan-vien.dto';
export declare class NhanVienService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.NhanVienDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateNhanVienDto): Promise<{
        isDeleted: boolean | null;
        id: string;
        diaChi: string;
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
    }>;
    update(id: string, data: UpdateNhanVienDto): Promise<{
        isDeleted: boolean | null;
        id: string;
        diaChi: string;
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
    }>;
}
