import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.RMQ,
    options: {
    urls: ['amqps://pciusdzy:HD5SGyYDTV6qzimospLz82iZE3IryKd4@codfish.rmq.cloudamqp.com/pciusdzy'],
    queue: 'main_queue',
    queueOptions: {
      durable: false
    },
  },
  })

  await app.listen()
}
bootstrap();