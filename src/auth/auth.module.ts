import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import config from 'src/common/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config.JWT.SECRET,
        signOptions: { expiresIn: config.JWT.EXPIRES_IN },
      }),
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
