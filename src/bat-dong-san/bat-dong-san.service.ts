import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatDongSanDto } from './dto/create-bat-dong-san.dto';
import { UpdateBatDongSanDto } from './dto/update-bat-dong-san.dto';

@Injectable()
export class BatDongSanService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.batDongSan;
  }

  create(data: CreateBatDongSanDto) {
    const { huong, moTa, ...batDongSanData } = data;
    const propertyId = `BDS${Date.now()}`.slice(0, 20);
    return this.prisma.batDongSan.create({
      data: {
        id: propertyId,
        khachHangId: batDongSanData.khachHangId,
        nhuCau: batDongSanData.nhuCau ?? null,
        tieuDe: batDongSanData.tieuDe,
        loaiBDS: batDongSanData.loaiBDS,
        diaChi: batDongSanData.diaChi,
        dienTich: batDongSanData.dienTich,
        giaTien: batDongSanData.giaTien as any,
        tinhTrang: batDongSanData.tinhTrang,
        isDeleted: false,
        ngayTao: new Date(),
        viTri: null,
        huong: huong ?? null,
        ghiChu: moTa ?? null,
        chiTiet: huong || moTa ? { create: { huong, moTa } } : undefined,
      },
    });
  }

  update(id: string, data: UpdateBatDongSanDto) {
    return this.prisma.batDongSan.update({
      where: { id },
      data: {
        ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
        ...(data.tieuDe ? { tieuDe: data.tieuDe } : {}),
        ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
        ...(data.diaChi ? { diaChi: data.diaChi } : {}),
        ...(data.dienTich !== undefined ? { dienTich: data.dienTich } : {}),
        ...(data.giaTien ? { giaTien: data.giaTien as any } : {}),
        ...(data.nhuCau ? { nhuCau: data.nhuCau } : {}),
        ...(data.tinhTrang ? { tinhTrang: data.tinhTrang } : {}),
      },
    });
  }
}