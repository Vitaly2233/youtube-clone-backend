import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { UserModule } from './user/user.module';
import { VideoStreamModule } from './video-stream/video-stream.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${config.SERVER_HOST}/${config.DB.DB_NAME}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
      },
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    UserModule,
    AuthModule,
    VideoStreamModule,
  ],
})
export class AppModule {}
