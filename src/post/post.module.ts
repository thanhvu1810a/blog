import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { Post, PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './post.service'
import { CategoryController } from '../category/category.controller';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { ImportProcessor } from './queues/queues';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema }
    ]),
    UserModule,

    // CacheModule.registerAsync({
    //   imports:[ConfigModule],
    //   inject:[ConfigService],
    //   useFactory: async(configService: ConfigService) => ({
    //     // isGlobal: true,
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<number>('REDIS_PORT'),
    //     username: configService.get<string>('REDIS_USERNAME'),
    //     password: configService.get<string>('REDIS_PASSWORD'),
    //   }),
    // }),
  ],
  controllers: [PostsController],
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