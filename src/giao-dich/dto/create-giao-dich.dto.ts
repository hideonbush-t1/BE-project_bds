import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGiaoDichDto {
  @IsString()
  @IsNotEmpty()
  nhanVienId!: string;

  @IsString()
  @IsNotEmpty()
  benMuaId!: string;

  @IsOptional()
  @IsString()
  benBanId?: string;

  @IsString()
  @IsNotEmpty()
  batDongSanId!: string;

  @IsString()
  @IsNotEmpty()
  ngayGD!: string;

  @IsString()
  @IsNotEmpty()
  soTien!: string;

  @IsOptional()
  @IsNumber()
  tyLeHoaHong?: number;

  @IsOptional()
  @IsString()
  moTaGD?: string;

  @IsString()
  @IsNotEmpty()
  tinhTrang!: string;
}