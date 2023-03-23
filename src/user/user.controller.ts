import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('username/:username')
  async getByUsername(@Param('username') username: string) {
    return this.userService.findOneByUsername(username);
  }
}
