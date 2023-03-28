import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir } from 'fs/promises';
import { AppModule } from './app.module';
import config from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const documentBuilder = new DocumentBuilder()
    .setTitle('Youtube')
    .setDescription('Clone of the youtube api')
    .setVersion('1.0')
    .addTag('youtube')
    .addBearerAuth()
    .build();

  try {
    await mkdir('./uploads');
  } catch (e) {}

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(config.SERVER_PORT);
}
bootstrap();
