import { CreateThongBaoDto } from './dto/create-thong-bao.dto';
import { UpdateThongBaoDto } from './dto/update-thong-bao.dto';
import { ThongBaoService } from './thong-bao.service';
export declare class ThongBaoController {
    private readonly service;
    constructor(service: ThongBaoService);
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    create(dto: CreateThongBaoDto): import(".prisma/client").Prisma.Prisma__ThongBaoClient<{
        tieuDe: string;
        noiDung: string;
        ngayDang: Date;
        isDeleted: boolean | null;
        id: number;
        nhanVienId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateThongBaoDto): import(".prisma/client").Prisma.Prisma__ThongBaoClient<{
        tieuDe: string;
        noiDung: string;
        ngayDang: Date;
        isDeleted: boolean | null;
        id: number;
        nhanVienId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): Promise<any>;
}
