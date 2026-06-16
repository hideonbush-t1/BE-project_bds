import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBieuMauDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  tenHoSo?: string;

  @IsOptional()
  @IsString()
  noiDung?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  duongDan?: string;
}