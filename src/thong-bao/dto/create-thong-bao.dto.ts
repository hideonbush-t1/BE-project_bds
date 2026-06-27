import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThongBaoDto {
  @IsString()
  @IsNotEmpty()
  tieuDe!: string; // THÊM DẤU ! Ở ĐÂY

  @IsString()
  @IsNotEmpty()
  noiDung!: string; // THÊM DẤU ! Ở ĐÂY

  @IsOptional()
  @IsString() // ĐỔI TỪ IsNumber SANG IsString
  nhanVienId?: string; // ĐỔI TỪ number SANG string
}