import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGiaoDichDto {
  @IsString()
  nhanVienId!: string;

  @IsString()
  benMuaId!: string;

  @IsOptional()
  @IsString()
  benBanId?: string;

  @IsString()
  batDongSanId!: string;

  @IsString()
  ngayGD!: string;

  @IsString()
  soTien!: string;

  @IsOptional()
  @IsNumber()
  tyLeHoaHong?: number;

  @IsOptional()
  @IsString()
  moTaGD?: string;

  @IsString()
  tinhTrang!: string;
}