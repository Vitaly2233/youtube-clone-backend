import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { UserModule } from './user/user.module';
import { VideoStreamModule } from './video-stream/video-stream.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: config.SERVER_HOST,
          port: config.DB.DB_PORT,
          database: config.DB.DB_NAME,

          username: config.DB.DB_USERNAME,
          password: config.DB.DB_PASSWORD,
          entities: ['dist/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,

          retryAttempts: 1,
        };
      },
    }),
    UserModule,
    AuthModule,
    VideoStreamModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
