import { CreateKhachHangDto } from './dto/create-khach-hang.dto';
import { UpdateKhachHangDto } from './dto/update-khach-hang.dto';
import { KhachHangService } from './khach-hang.service';
export declare class KhachHangController {
    private readonly service;
    constructor(service: KhachHangService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateKhachHangDto): import(".prisma/client").Prisma.Prisma__KhachHangClient<{
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
    update(id: string, dto: UpdateKhachHangDto): import(".prisma/client").Prisma.Prisma__KhachHangClient<{
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
    remove(id: string): Promise<any>;
}
