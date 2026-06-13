import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBatDongSanDto {
  @IsString()
  khachHangId!: string;

  @IsString()
  tieuDe!: string;

  @IsString()
  loaiBDS!: string;

  @IsString()
  diaChi!: string;

  @IsNumber()
  dienTich!: number;

  @IsString()
  giaTien!: string;

  @IsOptional()
  @IsString()
  nhuCau?: string;

  @IsString()
  tinhTrang!: string;

  @IsOptional()
  @IsString()
  huong?: string;

  @IsOptional()
  @IsString()
  moTa?: string;
}