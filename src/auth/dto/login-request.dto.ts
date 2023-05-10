import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../../user/entity/user.entity';

export class LoginRequestDto extends PickType(User, ['username', 'password']) {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
