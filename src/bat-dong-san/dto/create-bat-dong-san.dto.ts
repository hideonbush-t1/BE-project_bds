import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatDongSanDto {
  @IsString()
  khachHangId!: string;

  @IsString()
  tieuDe!: string;

  @IsString()
  loaiBDS!: string;

  @IsString()
  diaChi!: string;

  // Giữ nguyên logic ép kiểu siêu chuẩn của bạn
  @Type(() => Number) 
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
  viTri?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsString()
  moTa?: string;
}