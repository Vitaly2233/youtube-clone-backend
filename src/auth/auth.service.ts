import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import { ITokenData } from 'src/auth/interface/token-data.interface';
import { UserService } from 'src/user/user.service';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register({ username, password }: RegisterRequestDto) {
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
      const user = await this.userService.create({
        username,
        password: hashedPassword,
      });
      delete user.password;
      return user;
    } catch (e) {
      throw new ConflictException('username with the name is already exist');
    }
  }

  async login(username: string, password: string) {
    await this.validateUsernameAndPassword(username, password);
    const tokenData: ITokenData = {
      username,
    };
    const payload: LoginResponseDto = {
      access_token: this.jwtService.sign(tokenData),
    };

    return payload;
  }

  async validateUsernameAndPassword(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username, true);
    if (!user) throw new NotFoundException('user does not exist');

    const isEqual: boolean = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new ForbiddenException('wrong password');

    return user;
  }
}
