import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer'; // Cần để ép kiểu số

export class UpdateNhuCauDto {
  @IsOptional() @IsString() khachHangId?: string;
  @IsOptional() @IsString() loaiNC?: string;     // Khớp tên trường trong Prisma
  @IsOptional() @IsString() loaiBDS?: string;
  @IsOptional() @IsString() viTri?: string;

  @IsOptional() 
  @IsNumber() 
  @Type(() => Number) // BẮT BUỘC: Ép string "50" -> number 50
  dienTichMin?: number;

  @IsOptional() 
  @IsNumber() 
  @Type(() => Number) 
  dienTichMax?: number;

  @IsOptional() @IsString() giaMin?: string;
  @IsOptional() @IsString() giaMax?: string;
  @IsOptional() @IsString() ghiChu?: string;
}