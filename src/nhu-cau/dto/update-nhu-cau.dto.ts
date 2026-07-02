import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNhuCauDto {
  @IsOptional()
  @IsString()
  khachHangId?: string;

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
  @IsNumber()
  dienTichMin?: number;

  @IsOptional()
  @IsNumber()
  dienTichMax?: number;

  @IsOptional()
  giaMin?: string;

  @IsOptional()
  giaMax?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}