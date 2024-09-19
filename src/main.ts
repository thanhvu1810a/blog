import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle("Blog")
  .setDescription("List Api User and Blog")
  .setVersion('1.0')
  .addTag("Auth")
  .addTag("User")
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,document)
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(8000);
}

void bootstrap();
