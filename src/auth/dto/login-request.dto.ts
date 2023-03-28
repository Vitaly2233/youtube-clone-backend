import { IsString, Min } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
