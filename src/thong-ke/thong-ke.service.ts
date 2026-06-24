import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ThongKeService {
  constructor(private prisma: PrismaService) {}

  async getChartData(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const giaoDichTrongNam = await this.prisma.giaoDich.findMany({
      where: {
        ngayGD: { gte: startDate, lte: endDate }, // Đã sửa thành ngayGD
        tinhTrang: 'Hoàn thành',                  // Đã sửa thành tinhTrang
        isDeleted: false,                         // Đã sửa thành isDeleted
      },
    });

    const chartData = Array.from({ length: 12 }, (_, i) => ({
      thang: `Tháng ${i + 1}`,
      soLuong: 0,
      tongGiaTri: 0, 
      doanhThu: 0,   
    }));

    giaoDichTrongNam.forEach((gd) => {
      // Đã sửa thành ngayGD, soTien, tyLeHoaHong
      const monthIndex = gd.ngayGD.getMonth(); 
      const tien = Number(gd.soTien);
      const hoaHong = tien * (gd.tyLeHoaHong / 100);

      chartData[monthIndex].soLuong += 1;
      chartData[monthIndex].tongGiaTri += tien;
      chartData[monthIndex].doanhThu += hoaHong;
    });

    return chartData;
  }

  async getTableData(month: number, year: number) {
    const startDate = month > 0 
      ? new Date(year, month - 1, 1) 
      : new Date(year, 0, 1);
      
    const endDate = month > 0 
      ? new Date(year, month, 0, 23, 59, 59) 
      : new Date(year, 11, 31, 23, 59, 59);

    return this.prisma.giaoDich.findMany({
      where: {
        ngayGD: { gte: startDate, lte: endDate }, // Đã sửa thành ngayGD
        isDeleted: false,                         // Đã sửa thành isDeleted
      },
      orderBy: { ngayGD: 'desc' },                // Đã sửa thành ngayGD
      include: {
        nhanVien: {                               // Chú ý: relation thường là nhanVien (V viết hoa)
          select: { hoTen: true }                 // Lấy tên nhân viên
        }
      }
    });
  }
  async getYearlySummary(year: number) {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    // Lấy tất cả giao dịch HOÀN THÀNH trong năm
    const giaoDichTrongNam = await this.prisma.giaoDich.findMany({
      where: {
        ngayGD: { gte: startDate, lte: endDate },
        tinhTrang: 'Hoàn thành',
        isDeleted: false,
      },
    });

    let tongGiaoDich = 0;
    let tongGiaTriBDS = 0;
    let tongDoanhThu = 0;

    giaoDichTrongNam.forEach((gd) => {
      tongGiaoDich += 1;
      const tien = Number(gd.soTien);
      const hoaHong = tien * (gd.tyLeHoaHong / 100);
      
      tongGiaTriBDS += tien;
      tongDoanhThu += hoaHong;
    });

    return {
      nam: year,
      tongGiaoDich,
      tongGiaTriBDS,
      tongDoanhThu,
    };
  }
}