import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBatDongSanDto {
  @IsOptional()
  @IsString()
  khachHangId?: string;

  @IsOptional()
  @IsString()
  tieuDe?: string;

  @IsOptional()
  @IsString()
  loaiBDS?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsNumber()
  dienTich?: number;

  @IsOptional()
  @IsString()
  giaTien?: string;

  @IsOptional()
  @IsString()
  nhuCau?: string;

  @IsOptional()
  @IsString()
  tinhTrang?: string;
}