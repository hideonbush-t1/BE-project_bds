import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNhuCauDto {
  @IsOptional()
  @IsString()
  khachHangId?: string;

  // Thêm nhanVienId để đồng bộ với CreateDto
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

  // ĐÂY LÀ DÒNG CHỐT HẠ ĐỂ MỞ KHÓA UPDATE TRẠNG THÁI:
  @IsOptional()
  @IsString()
  tinhTrang?: string;
}