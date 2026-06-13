import { NhanVienService } from './nhan-vien.service';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto';
import { UpdateNhanVienDto } from './dto/update-nhan-vien.dto';
export declare class NhanVienController {
    private readonly service;
    constructor(service: NhanVienService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateNhanVienDto): Promise<{
        isDeleted: boolean | null;
        id: string;
        diaChi: string;
        ngayTao: Date | null;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: Date;
        soDienThoai: string;
        email: string;
        anhDaiDien: string | null;
        matKhau: string;
        chucVu: string;
        admin: string;
        tenDangNhap: string | null;
    }>;
    update(id: string, dto: UpdateNhanVienDto): Promise<{
        isDeleted: boolean | null;
        id: string;
        diaChi: string;
        ngayTao: Date | null;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: Date;
        soDienThoai: string;
        email: string;
        anhDaiDien: string | null;
        matKhau: string;
        chucVu: string;
        admin: string;
        tenDangNhap: string | null;
    }>;
    remove(id: string): Promise<any>;
}
