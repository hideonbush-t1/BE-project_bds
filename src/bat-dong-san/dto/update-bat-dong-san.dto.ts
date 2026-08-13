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

  // Giữ nguyên logic của bạn
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

  @IsOptional()
  @IsString()
  viTri?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsString()
  moTa?: string;

  // CHỈ THÊM ĐÚNG DÒNG NÀY ĐỂ FIX LỖI XÓA ẢNH (400 Bad Request)
  @IsOptional()
  @IsString()
  deletedImages?: string;
}