import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ThongKeService {
  constructor(private prisma: PrismaService) {}

  // Hàm helper tự động tính khoảng thời gian dựa trên period
  private getDateRange(year: number, period?: string) {
    let start = new Date(`${year}-01-01T00:00:00.000Z`);
    let end = new Date(`${year}-12-31T23:59:59.999Z`);

    if (period && period !== 'all') {
      if (period.startsWith('thang-')) {
        const m = parseInt(period.split('-')[1]);
        start = new Date(year, m - 1, 1);
        end = new Date(year, m, 0, 23, 59, 59);
      } else if (period.startsWith('quy-')) {
        const q = parseInt(period.split('-')[1]);
        start = new Date(year, (q - 1) * 3, 1);
        end = new Date(year, q * 3, 0, 23, 59, 59);
      } else if (period === 'nua-dau') {
        start = new Date(year, 0, 1);
        end = new Date(year, 5, 30, 23, 59, 59); // Tháng 6 có 30 ngày
      } else if (period === 'nua-sau') {
        start = new Date(year, 6, 1);
        end = new Date(year, 11, 31, 23, 59, 59);
      }
    }
    return { start, end };
  }

  // Helper tạo điều kiện query
  private buildWhereClause(year: number, period?: string, nhanVienId?: string, isCompletedOnly = false) {
    const { start, end } = this.getDateRange(year, period);
    const where: any = {
      ngayGD: { gte: start, lte: end },
      isDeleted: false,
    };
    if (isCompletedOnly) where.tinhTrang = 'Hoàn thành';
    
    if (nhanVienId && nhanVienId !== 'all') {
      where.nhanVienId = nhanVienId; 
    }
    return where;
  }

  async getYearlySummary(year: number, period?: string, nhanVienId?: string) {
    const giaoDichThanhCong = await this.prisma.giaoDich.findMany({
      where: this.buildWhereClause(year, period, nhanVienId, true),
    });

    let tongGiaoDich = 0, tongGiaTriBDS = 0, tongDoanhThu = 0;
    giaoDichThanhCong.forEach((gd) => {
      tongGiaoDich += 1;
      const tien = Number(gd.soTien);
      tongGiaTriBDS += tien;
      tongDoanhThu += tien * (gd.tyLeHoaHong / 100);
    });

    return { nam: year, tongGiaoDich, tongGiaTriBDS, tongDoanhThu };
  }

  async getChartData(year: number, period?: string, nhanVienId?: string) {
    const giaoDichThanhCong = await this.prisma.giaoDich.findMany({
      where: this.buildWhereClause(year, period, nhanVienId, true),
    });

    const chartData = Array.from({ length: 12 }, (_, i) => ({
      thang: `Tháng ${i + 1}`, soLuong: 0, tongGiaTri: 0, doanhThu: 0, 
    }));

    giaoDichThanhCong.forEach((gd) => {
      const monthIndex = gd.ngayGD.getMonth(); 
      const tien = Number(gd.soTien);
      chartData[monthIndex].soLuong += 1;
      chartData[monthIndex].tongGiaTri += tien;
      chartData[monthIndex].doanhThu += tien * (gd.tyLeHoaHong / 100);
    });

    return chartData;
  }

  async getTableData(year: number, period?: string, nhanVienId?: string) {
    return this.prisma.giaoDich.findMany({
      where: this.buildWhereClause(year, period, nhanVienId, false),
      orderBy: { ngayGD: 'desc' },
      include: { 
        nhanVien: { select: { hoTen: true } },
        batDongSan: { select: { tieuDe: true } } 
      }
    });
  }

  // 👇 THÊM MỚI: API Lấy Top Nhân Viên
  async getTopNhanVien(year: number, period?: string, limit: number = 10) {
    const giaoDichThanhCong = await this.prisma.giaoDich.findMany({
      where: this.buildWhereClause(year, period, 'all', true),
      include: { nhanVien: { select: { hoTen: true } } }
    });

    const mapData = new Map<string, any>();

    giaoDichThanhCong.forEach((gd) => {
      if (!gd.nhanVienId) return;
      
      const tien = Number(gd.soTien);
      const doanhThu = tien * (gd.tyLeHoaHong / 100);

      if (!mapData.has(gd.nhanVienId)) {
        mapData.set(gd.nhanVienId, {
          id: gd.nhanVienId,
          hoTen: gd.nhanVien?.hoTen || 'Không xác định',
          soGiaoDich: 0,
          tongGiaTri: 0,
          doanhThu: 0
        });
      }

      const nv = mapData.get(gd.nhanVienId);
      nv.soGiaoDich += 1;
      nv.tongGiaTri += tien;
      nv.doanhThu += doanhThu;
    });

    // Sắp xếp theo doanh thu giảm dần và lấy Top (limit)
    return Array.from(mapData.values())
      .sort((a, b) => b.doanhThu - a.doanhThu)
      .slice(0, limit);
  }
}