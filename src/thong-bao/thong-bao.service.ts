import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from '../common/crud/prisma-crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThongBaoDto } from './dto/create-thong-bao.dto';
import { UpdateThongBaoDto } from './dto/update-thong-bao.dto';

@Injectable()
export class ThongBaoService extends PrismaCrudService {
  constructor(private readonly prisma: PrismaService) {
    super();
    this.whereKey = 'id';
  }

  protected get delegate() {
    return this.prisma.thongBao;
  }

  create(data: CreateThongBaoDto) {
    return this.prisma.thongBao.create({
      data: {
        tieuDe: data.tieuDe,
        noiDung: data.noiDung,
        ngayDang: new Date(),
        nhanVienId: data.nhanVienId,
        isDeleted: false,
      },
    });
  }

  update(id: number, data: UpdateThongBaoDto) {
    return this.prisma.thongBao.update({
      where: { id },
      data: {
        ...(data.tieuDe ? { tieuDe: data.tieuDe } : {}),
        ...(data.noiDung ? { noiDung: data.noiDung } : {}),
        ...(data.nhanVienId ? { nhanVienId: data.nhanVienId } : {}),
      },
    });
  }
}