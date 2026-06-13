import { CreateGiaoDichDto } from './dto/create-giao-dich.dto';
import { UpdateGiaoDichDto } from './dto/update-giao-dich.dto';
import { GiaoDichService } from './giao-dich.service';
export declare class GiaoDichController {
    private readonly service;
    constructor(service: GiaoDichService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateGiaoDichDto): import(".prisma/client").Prisma.Prisma__GiaoDichClient<{
        isDeleted: boolean | null;
        id: string;
        nhanVienId: string;
        tinhTrang: string;
        ngayTao: Date | null;
        batDongSanId: string;
        benBan: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal;
        ngayGD: Date;
        tyLeHoaHong: number;
        moTaGD: string | null;
        benMua: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateGiaoDichDto): import(".prisma/client").Prisma.Prisma__GiaoDichClient<{
        isDeleted: boolean | null;
        id: string;
        nhanVienId: string;
        tinhTrang: string;
        ngayTao: Date | null;
        batDongSanId: string;
        benBan: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal;
        ngayGD: Date;
        tyLeHoaHong: number;
        moTaGD: string | null;
        benMua: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): Promise<any>;
}
