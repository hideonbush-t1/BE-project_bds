import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNhuCauDto {
  @IsNotEmpty()
  @IsString()
  khachHangId!: string;

  @IsNotEmpty()
  @IsString()
  loaiNC!: string; // Đã đổi từ loaiNhuCau thành loaiNC để khớp với Prisma

  @IsNotEmpty()
  @IsString()
  loaiBDS!: string;

  @IsNotEmpty()
  @IsString()
  viTri!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Ép kiểu string từ Frontend thành number
  dienTichMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Ép kiểu string từ Frontend thành number
  dienTichMax?: number;

  @IsOptional()
  @IsString()
  giaMin?: string;

  @IsOptional()
  @IsString()
  giaMax?: string;

  @IsOptional()
  @IsString()
  ghiChu?: string;
}