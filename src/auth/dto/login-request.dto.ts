import { IsString, Min } from 'class-validator';

export class LoginRequestDto {
  username: string;
  password: string;
}
