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

  // Sử dụng Type để ép kiểu chuỗi từ FormData sang Number
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

  // Đã thêm trường viTri
  @IsOptional()
  @IsString()
  viTri?: string;

  // Đã thêm trường ghiChu để khớp với Frontend
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsString()
  moTa?: string;
}