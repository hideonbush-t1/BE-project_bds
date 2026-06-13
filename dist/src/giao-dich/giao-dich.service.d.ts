import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGiaoDichDto } from './dto/create-giao-dich.dto';
import { UpdateGiaoDichDto } from './dto/update-giao-dich.dto';
export declare class GiaoDichService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.GiaoDichDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateGiaoDichDto): import(".prisma/client").Prisma.Prisma__GiaoDichClient<{
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
    update(id: string, data: UpdateGiaoDichDto): import(".prisma/client").Prisma.Prisma__GiaoDichClient<{
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
}
