import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${config.SERVER_HOST}/${config.DB.DB_NAME}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
      },
    ),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
