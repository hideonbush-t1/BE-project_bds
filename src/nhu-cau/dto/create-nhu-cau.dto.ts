import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNhuCauDto {
  @IsString()
  khachHangId!: string;

  @IsString()
  loaiNhuCau!: string;

  @IsString()
  loaiBDS!: string;

  @IsString()
  viTri!: string;

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