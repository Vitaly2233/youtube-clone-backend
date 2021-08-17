import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('username/:username')
  async getByUsername(@Param('username') username: string) {
    return await this.userService.findOneByUsername(username);
  }
}
