import { IsDateString, IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateKhachHangDto {
  @IsOptional()
  @IsString()
  maKH?: string;

  @IsOptional()
  @IsEnum(['Cá nhân', 'Doanh nghiệp'], { message: "Loại khách hàng phải là 'Cá nhân' hoặc 'Doanh nghiệp'" })
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
  @IsString()
  nhanVienId?: string;

  @IsOptional()
  @IsString()
  soCMND?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}