import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../common/guard/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }

  @Patch()
  updateUser(@Body() dto: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(req.user, dto);
  }

  @Delete()
  deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req.user.id);
  }
}
