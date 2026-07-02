import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateNhanVienDto {
  @IsOptional()
  @IsString()
  maNV?: string;

  @IsOptional()
  @IsString()
  hoTen?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  matKhau?: string;

  @IsOptional()
  @IsString()
  chucVu?: string;

  @IsString()
  @IsOptional()
  Role?: string;
}