import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  async register(@Body() body: RegisterRequestDto) {
    const { password, username } = body;
    console.log('here');

    return await this.authService.register(username, password);
  }

  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const { password, username } = body;
    return this.authService.login(username, password);
  }
}
