import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log(`applocation started on port: ${config.SERVER_PORT}`);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(config.SERVER_PORT);
}
bootstrap();
