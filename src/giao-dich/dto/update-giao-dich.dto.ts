import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGiaoDichDto {
  @IsOptional()
  @IsString()
  nhanVienId?: string;

  @IsOptional()
  @IsString()
  benMuaId?: string;

  @IsOptional()
  @IsString()
  benBanId?: string;

  @IsOptional()
  @IsString()
  batDongSanId?: string;

  @IsOptional()
  @IsString()
  ngayGD?: string;

  @IsOptional()
  @IsString()
  soTien?: string;

  @IsOptional()
  @IsNumber()
  tyLeHoaHong?: number;

  @IsOptional()
  @IsString()
  moTaGD?: string;

  @IsOptional()
  @IsString()
  tinhTrang?: string;
}