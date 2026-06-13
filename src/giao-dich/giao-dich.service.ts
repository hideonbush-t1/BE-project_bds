import { Injectable } from '@nestjs/common';
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
        soTien: data.soTien as any,
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
        ...(data.nhanVienId ? { nhanVienId: data.nhanVienId } : {}),
        ...(data.benMuaId ? { benMua: data.benMuaId } : {}),
        ...(data.benBanId ? { benBan: data.benBanId } : {}),
        ...(data.batDongSanId ? { batDongSanId: data.batDongSanId } : {}),
        ...(data.soTien ? { soTien: data.soTien as any } : {}),
        ...(data.ngayGD ? { ngayGD: new Date(data.ngayGD) } : {}),
        ...(data.tyLeHoaHong !== undefined ? { tyLeHoaHong: data.tyLeHoaHong } : {}),
        ...(data.moTaGD ? { moTaGD: data.moTaGD } : {}),
        ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}),
      },
    });
  }
}