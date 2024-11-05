import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port: number = configService.get<number>('app.http.port');

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
  .setTitle("Blog")
  .setDescription("List Api User and Blog")
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
  )
  .build()
  app.enableCors()

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api',app,document)

  await app.listen(port);
}

void bootstrap();
