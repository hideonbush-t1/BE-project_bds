import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNhuCauDto } from './dto/create-nhu-cau.dto';
import { UpdateNhuCauDto } from './dto/update-nhu-cau.dto';

@Injectable()
export class NhuCauService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.nhuCau;
  }

  create(data: CreateNhuCauDto) {
    return this.prisma.nhuCau.create({
      data: {
        id: `NC${Date.now()}`.slice(0, 20),
        khachHangId: data.khachHangId,
        loaiNC: data.loaiNhuCau,
        loaiBDS: data.loaiBDS,
        viTri: data.viTri,
        dienTichMin: data.dienTichMin,
        dienTichMax: data.dienTichMax,
        ghiChu: data.ghiChu,
        isDeleted: false,
      },
    });
  }

  update(id: string, data: UpdateNhuCauDto) {
    return this.prisma.nhuCau.update({
      where: { id },
      data: {
        ...(data.khachHangId ? { khachHangId: data.khachHangId } : {}),
        ...(data.loaiNhuCau ? { loaiNC: data.loaiNhuCau } : {}),
        ...(data.loaiBDS ? { loaiBDS: data.loaiBDS } : {}),
        ...(data.viTri ? { viTri: data.viTri } : {}),
        ...(data.dienTichMin !== undefined ? { dienTichMin: data.dienTichMin } : {}),
        ...(data.dienTichMax !== undefined ? { dienTichMax: data.dienTichMax } : {}),
        ...(data.ghiChu ? { ghiChu: data.ghiChu } : {}),
      },
    });
  }
}