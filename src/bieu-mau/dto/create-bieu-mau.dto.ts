import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBieuMauDto {
  @IsString()
  @MaxLength(150)
  tenHoSo!: string;

  @IsOptional()
  @IsString()
  noiDung?: string;
}