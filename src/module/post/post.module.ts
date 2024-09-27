import { Module } from '@nestjs/common';
import { Post, PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './post.service'
import { UserModule } from 'src/module/user/user.module';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { ImportProcessor } from './queues/queues';
import { BullModule } from '@nestjs/bullmq';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    BullModule.registerQueue({
      name: 'import',
    }),
    UserModule,
  ],
  controllers: [],
  providers: [PostsService,ImportProcessor,
    {
      provide: 'IMPORT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const rmqUser: string = configService.get<string>(
          'rabbitmq.rabbitmq.user',
        );
        const rmqPass: string = configService.get<string>(
          'rabbitmq.rabbitmq.password',
        );
        const rmqHost: string = configService.get<string>(
          'rabbitmq.rabbitmq.host',
        );
        const rmqQueue: string = configService.get<string>(
          'rabbitmq.rabbitmq.queue',
        );

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${rmqUser}:${rmqPass}@${rmqHost}`],
            queue: rmqQueue,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    }
  ],
  exports:[PostsService]
})
export class PostsModule {}