import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class UpdateUserDto extends PartialType(
  PickType(User, ['firstName', 'lastName', 'birthDate']),
) {}
