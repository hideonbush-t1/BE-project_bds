import { IsString } from 'class-validator';

export class CreateThongBaoDto {
  @IsString()
  tieuDe!: string;

  @IsString()
  noiDung!: string;

  @IsString()
  nhanVienId!: string;
}