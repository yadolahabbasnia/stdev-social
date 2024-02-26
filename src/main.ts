import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors(); // Enable CORS if needed

  const port = Number(configService.get('PORT'));
  const baseUrl = configService.get('BASE_URL');
  const appName = configService.get('APP_NAME');

  if (configService.get('NODE_ENV') === 'development') {
    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription(`${appName} API description`)
      .setVersion('1.0')
      .addServer(baseUrl)
      .addBearerAuth() // Global security requirement for bearer token
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(port);
  Logger.log(`Application is running on port ${port}`);
}

bootstrap();
