import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNhanVienDto {
  @IsString()
  maNV!: string;

  @IsString()
  hoTen!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  soDienThoai?: string;

  @IsString()
  @MinLength(6)
  matKhau!: string;

  @IsString()
  chucVu!: string;

  @IsBoolean()
  isAdmin!: boolean;
}