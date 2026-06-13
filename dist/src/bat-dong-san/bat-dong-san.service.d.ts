import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';
export declare class BatDongSanService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.BatDongSanDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateBatDongSanDto): import(".prisma/client").Prisma.Prisma__BatDongSanClient<{
        tieuDe: string | null;
        isDeleted: boolean | null;
        id: string;
        khachHangId: string;
        nhuCau: string | null;
        loaiBDS: string;
        diaChi: string;
        dienTich: number;
        giaTien: import("@prisma/client/runtime/library").Decimal;
        tinhTrang: string;
        ngayTao: Date | null;
        ngayCapNhat: Date | null;
        viTri: string | null;
        huong: string | null;
        ghiChu: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateBatDongSanDto): import(".prisma/client").Prisma.Prisma__BatDongSanClient<{
        tieuDe: string | null;
        isDeleted: boolean | null;
        id: string;
        khachHangId: string;
        nhuCau: string | null;
        loaiBDS: string;
        diaChi: string;
        dienTich: number;
        giaTien: import("@prisma/client/runtime/library").Decimal;
        tinhTrang: string;
        ngayTao: Date | null;
        ngayCapNhat: Date | null;
        viTri: string | null;
        huong: string | null;
        ghiChu: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
