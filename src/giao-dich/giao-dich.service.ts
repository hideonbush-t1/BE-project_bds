import { Injectable, NotFoundException } from '@nestjs/common'; 
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
  // TASK REF2: THUẬT TOÁN MATCHING & TÍNH ĐIỂM TƯƠNG ĐỒNG
  // =======================================================
  async suggest(nhuCauId: string) {
    // 1. Tìm thông tin Nhu cầu của khách
    const nhuCau = await this.prisma.nhuCau.findUnique({ 
      where: { id: nhuCauId } 
    });

    if (!nhuCau) {
      throw new NotFoundException('Không tìm thấy dữ liệu nhu cầu này!');
    }

    // 2. Lấy TẤT CẢ BĐS đang Trống (Không lọc cứng nữa để làm data chấm điểm)
    const danhSachBdsTrong = await this.prisma.batDongSan.findMany({
      where: {
        isDeleted: false,
        tinhTrang: { notIn: ['Đã bán', 'Đang giao dịch', 'Đã cọc'] }
      }
    });

    // 3. Chấm điểm từng BĐS dựa trên nhu cầu (Thang 100 điểm)
    const scoredList = danhSachBdsTrong.map(bds => {
      let score = 0;

      // Tiêu chí 1: Khớp Loại BĐS (40 điểm) - Tiêu chí tiên quyết
      if (nhuCau.loaiBDS && bds.loaiBDS === nhuCau.loaiBDS) {
        score += 40;
      }

      // Tiêu chí 2: Khớp Vị trí / Khu vực (30 điểm)
      if (nhuCau.viTri && bds.diaChi) {
        // Chuyển về chữ thường để so sánh không phân biệt hoa/thường
        const viTriNc = nhuCau.viTri.toLowerCase();
        const diaChiBds = bds.diaChi.toLowerCase();
        
        // Nếu địa chỉ BĐS chứa tên khu vực khách tìm, hoặc ngược lại
        if (diaChiBds.includes(viTriNc) || viTriNc.includes(diaChiBds)) {
          score += 30;
        }
      }

      // Tiêu chí 3: Khớp Diện tích (30 điểm)
      if (nhuCau.dienTichMin || nhuCau.dienTichMax) {
        const min = nhuCau.dienTichMin || 0;
        const max = nhuCau.dienTichMax || 999999;
        const dt = bds.dienTich || 0;

        if (dt >= min && dt <= max) {
          score += 30; // Nằm chuẩn trong khoảng
        } else if (dt >= min * 0.8 && dt <= max * 1.2) {
          score += 15; // Chênh lệch 20% diện tích vẫn cho điểm vớt
        }
      }

      return {
        ...bds,
        matchingScore: score // Gắn điểm vào object trả về để Frontend dùng
      };
    });

    // 4. Lọc, sắp xếp và lấy Top 15 căn tốt nhất
    const danhSachGoiY = scoredList
      // Chỉ lấy những căn đạt ít nhất 30 điểm (Bèo nhất cũng phải đúng Loại BĐS hoặc Vị trí)
      .filter(item => item.matchingScore >= 30) 
      // Sắp xếp điểm từ cao xuống thấp
      .sort((a, b) => b.matchingScore - a.matchingScore)
      .slice(0, 15);

    // 5. Trả về kết quả
    return {
      thongTinNhuCau: nhuCau,
      soLuongPhuHop: danhSachGoiY.length,
      danhSachGoiY: danhSachGoiY,
    };
  }
}