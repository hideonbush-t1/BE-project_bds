export class GiaoDichEntity {
  id!: number;
  nhanVienId!: number;
  benMuaId?: number | null;
  benBanId?: number | null;
  batDongSanId!: number;
  ngayGD!: Date;
  soTien!: string;
  tyLeHoaHong?: number | null;
  moTaGD?: string | null;
  tinhTrang!: string;
}