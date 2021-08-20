import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import config from 'src/common/config';
import { JwtStrategy } from './srategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
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
