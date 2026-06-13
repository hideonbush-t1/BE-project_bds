import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  maNV!: string;

  @IsString()
  @MinLength(6)
  matKhau!: string;
}