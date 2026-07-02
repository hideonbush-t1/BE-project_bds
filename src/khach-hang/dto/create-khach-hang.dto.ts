import { IsDateString, IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateKhachHangDto {
  // Chuyển từ '!' (bắt buộc) sang '?' (tùy chọn) 
  // để Backend tự sinh mã mà không bị validator chặn
  @IsOptional()
  @IsString()
  maKH?: string;

  @IsEnum(['Cá nhân', 'Doanh nghiệp'], { message: "Loại khách hàng phải là 'Cá nhân' hoặc 'Doanh nghiệp'" })
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
  @IsString()
  nhanVienId?: string;

  @IsOptional()
  @IsString()
  soCMND?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}