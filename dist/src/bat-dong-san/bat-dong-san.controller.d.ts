import { BatDongSanService } from './bat-dong-san.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';
export declare class BatDongSanController {
    private readonly service;
    constructor(service: BatDongSanService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateBatDongSanDto): import(".prisma/client").Prisma.Prisma__BatDongSanClient<{
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
    update(id: string, dto: UpdateBatDongSanDto): import(".prisma/client").Prisma.Prisma__BatDongSanClient<{
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
    remove(id: string): Promise<any>;
}
