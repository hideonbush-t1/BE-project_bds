import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateKhachHangDto {
  @IsString()
  maKH!: string;

  @IsString()
  loaiKH!: string;

  @IsString()
  hoTen!: string;

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