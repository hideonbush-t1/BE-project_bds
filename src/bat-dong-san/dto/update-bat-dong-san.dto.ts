import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

  // Ép kiểu cho trường hợp cập nhật
  @IsOptional()
  @Type(() => Number)
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

  @IsOptional()
  @IsString()
  huong?: string;

  // Đã thêm trường viTri
  @IsOptional()
  @IsString()
  viTri?: string;

  // Đã thêm trường ghiChu
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsString()
  moTa?: string;
}