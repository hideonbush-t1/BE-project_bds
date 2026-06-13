import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateKhachHangDto {
  @IsOptional()
  @IsString()
  maKH?: string;

  @IsOptional()
  @IsString()
  loaiKH?: string;

  @IsOptional()
  @IsString()
  hoTen?: string;

  @IsOptional()
  @IsString()
  gioiTinh?: string;

  @IsOptional()
  @IsDateString()
  ngaySinh?: string;

  @IsOptional()
  @IsString()
  diaChi?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}