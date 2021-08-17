import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { VideoStreamModule } from './video-stream/video-stream.module';

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
          autoLoadEntities: true,
          synchronize: true,
          retryDelay: 1000,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    UserModule,
    AuthModule,
    VideoStreamModule,
  ],
})
export class AppModule {}
