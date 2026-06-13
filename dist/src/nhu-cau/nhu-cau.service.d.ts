import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';
export declare class NhuCauService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.NhuCauDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateNhuCauDto): import(".prisma/client").Prisma.Prisma__NhuCauClient<{
        isDeleted: boolean | null;
        id: string;
        khachHangId: string;
        loaiBDS: string;
        viTri: string;
        ghiChu: string | null;
        loaiNC: string;
        dienTichMin: number | null;
        dienTichMax: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateNhuCauDto): import(".prisma/client").Prisma.Prisma__NhuCauClient<{
        isDeleted: boolean | null;
        id: string;
        khachHangId: string;
        loaiBDS: string;
        viTri: string;
        ghiChu: string | null;
        loaiNC: string;
        dienTichMin: number | null;
        dienTichMax: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
