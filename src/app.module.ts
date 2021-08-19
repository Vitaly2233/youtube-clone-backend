import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
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

          username: 'root',
          password: '1234',
          entities: ['dist/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,

          retryAttempts: 1,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    UserModule,
    AuthModule,
    VideoModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
