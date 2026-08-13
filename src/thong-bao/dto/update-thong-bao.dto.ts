import { IsOptional, IsString } from 'class-validator';

export class UpdateThongBaoDto {
  @IsOptional()
  @IsString()
  tieuDe?: string;

  @IsOptional()
  @IsString()
  noiDung?: string;

  @IsOptional()
  @IsString()
  nhanVienId?: string;
}