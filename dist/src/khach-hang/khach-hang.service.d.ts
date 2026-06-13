import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
export declare class KhachHangService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.KhachHangDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateKhachHangDto): import(".prisma/client").Prisma.Prisma__KhachHangClient<{
        isDeleted: boolean | null;
        id: string;
        nhanVienId: string | null;
        diaChi: string;
        ngayTao: Date | null;
        loaiKH: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: Date;
        soDienThoai: string;
        email: string | null;
        soCMND: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateKhachHangDto): import(".prisma/client").Prisma.Prisma__KhachHangClient<{
        isDeleted: boolean | null;
        id: string;
        nhanVienId: string | null;
        diaChi: string;
        ngayTao: Date | null;
        loaiKH: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: Date;
        soDienThoai: string;
        email: string | null;
        soCMND: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
