import { Injectable, NotFoundException } from '@nestjs/common'; // Thêm NotFoundException
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGiaoDichDto } from './dto/create-giao-dich.dto';
import { UpdateGiaoDichDto } from './dto/update-giao-dich.dto';

@Injectable()
export class GiaoDichService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.giaoDich;
  }

  create(data: CreateGiaoDichDto) {
    return this.prisma.giaoDich.create({
      data: {
        id: `GD${Date.now()}`.slice(0, 20),
        nhanVienId: data.nhanVienId,
        benMua: data.benMuaId,
        benBan: data.benBanId ?? null,
        batDongSanId: data.batDongSanId,
        soTien: Number(data.soTien), 
        ngayGD: new Date(data.ngayGD),
        tyLeHoaHong: data.tyLeHoaHong ?? 0,
        moTaGD: data.moTaGD ?? null,
        tinhTrang: data.tinhTrang,
        isDeleted: false,
        ngayTao: new Date(),
      },
    });
  }

  update(id: string, data: UpdateGiaoDichDto) {
    return this.prisma.giaoDich.update({
      where: { id },
      data: {
        ...(data.nhanVienId && { nhanVienId: data.nhanVienId }),
        ...(data.benMuaId && { benMua: data.benMuaId }),
        ...(data.benBanId && { benBan: data.benBanId }),
        ...(data.batDongSanId && { batDongSanId: data.batDongSanId }),
        ...(data.soTien && { soTien: Number(data.soTien) }),
        ...(data.ngayGD && { ngayGD: new Date(data.ngayGD) }),
        ...(data.tyLeHoaHong !== undefined && { tyLeHoaHong: data.tyLeHoaHong }),
        ...(data.moTaGD && { moTaGD: data.moTaGD }),
        ...(data.tinhTrang && { tinhTrang: data.tinhTrang }),
      },
    });
  }

  // =======================================================
  // THÊM MỚI: THUẬT TOÁN MATCHING (GỢI Ý GIAO DỊCH)
  // =======================================================
  async suggest(nhuCauId: string) {
    // 1. Tìm thông tin Nhu cầu của khách
    const nhuCau = await this.prisma.nhuCau.findUnique({ 
      where: { id: nhuCauId } 
    });

    if (!nhuCau) {
      throw new NotFoundException('Không tìm thấy dữ liệu nhu cầu này!');
    }

    // 2. Lên điều kiện lọc BĐS (Chỉ lấy BĐS trống/chưa bán)
    const filter: any = {
      isDeleted: false,
      // Có thể thêm điều kiện tinhTrang: 'Đang mở bán' nếu database sếp có lưu
    };

    // Lọc theo Loại BĐS
    if (nhuCau.loaiBDS) {
      filter.loaiBDS = nhuCau.loaiBDS;
    }

    // Lọc theo Diện tích
    if (nhuCau.dienTichMin || nhuCau.dienTichMax) {
      filter.dienTich = {};
      if (nhuCau.dienTichMin) filter.dienTich.gte = nhuCau.dienTichMin;
      if (nhuCau.dienTichMax) filter.dienTich.lte = nhuCau.dienTichMax;
    }

    // Lọc theo Khu vực (Tìm kiếm chuỗi tương đối)
    if (nhuCau.viTri) {
      filter.diaChi = {
        contains: nhuCau.viTri,
      };
    }

    // 3. Truy vấn kho dữ liệu
    const danhSachGoiY = await this.prisma.batDongSan.findMany({
      where: filter,
      take: 15, // Lấy tối đa 15 kết quả gợi ý tốt nhất
      orderBy: { ngayTao: 'desc' } // Ưu tiên nhà mới đăng
    });

    // 4. Trả về format chuẩn để Frontend đọc được
    return {
      thongTinNhuCau: nhuCau,
      soLuongPhuHop: danhSachGoiY.length,
      danhSachGoiY: danhSachGoiY,
    };
  }
}