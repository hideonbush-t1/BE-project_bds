import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNhuCauDto {
  @IsString()
  khachHangId!: string; // Add the '!' here

  @IsOptional()
  @IsString()
  nhanVienId?: string;

  @IsOptional()
  @IsString()
  loaiNhuCau?: string;

  @IsOptional()
  @IsString()
  loaiBDS?: string;

  @IsOptional()
  @IsString()
  viTri?: string;

  @IsOptional()
  dienTichMin?: number;

  @IsOptional()
  dienTichMax?: number;

  @IsOptional()
  @IsString()
  ghiChu?: string;

  @IsOptional()
  @IsString()
  tinhTrang?: string; 
}