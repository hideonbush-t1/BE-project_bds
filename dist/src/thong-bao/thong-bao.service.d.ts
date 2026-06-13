import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThongBaoDto } from './dto/create-thong-bao.dto';
import { UpdateThongBaoDto } from './dto/update-thong-bao.dto';
export declare class ThongBaoService extends PrismaCrudService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    protected get delegate(): import(".prisma/client").Prisma.ThongBaoDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: CreateThongBaoDto): import(".prisma/client").Prisma.Prisma__ThongBaoClient<{
        tieuDe: string;
        noiDung: string;
        ngayDang: Date;
        isDeleted: boolean | null;
        id: number;
        nhanVienId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, data: UpdateThongBaoDto): import(".prisma/client").Prisma.Prisma__ThongBaoClient<{
        tieuDe: string;
        noiDung: string;
        ngayDang: Date;
        isDeleted: boolean | null;
        id: number;
        nhanVienId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
