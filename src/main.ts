import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const documentBuilder = new DocumentBuilder()
    .setTitle('Youtube')
    .setDescription('Clone of the youtube api')
    .setVersion('1.0')
    .addTag('youtube')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.SERVER_PORT);
}
bootstrap();
