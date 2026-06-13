import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';
import { NhuCauService } from './nhu-cau.service';
export declare class NhuCauController {
    private readonly service;
    constructor(service: NhuCauService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateNhuCauDto): import(".prisma/client").Prisma.Prisma__NhuCauClient<{
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
    update(id: string, dto: UpdateNhuCauDto): import(".prisma/client").Prisma.Prisma__NhuCauClient<{
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
    remove(id: string): Promise<any>;
}
