import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './common/role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './module/post/post.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CategoryModule } from './module/category/category.module';
import configs from './config';
import { RouterModule } from './router/router.module';
import { RolesGuard } from './common/role/guard/roles.guard';
import { CacheConfigModule } from './common/cache/cache.module';
import { QueueConfigModule } from './common/queues/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL,{autoCreate:true}),
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async(config:ConfigService)=>({
        transport:{
          host: config.get('MAIL_HOST'),
          secure:false,
          auth:{
            user:config.get('MAIL_USER'),
            pass:config.get('MAIL_PASS')
          }
        },
        defaults:{
          from:`"NO REPLAY" <${config.get('MAIL_FROM')}>`
        },
        template:{
          dir: join(__dirname,'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options:{
            strict:true
          }
        }
      }),
      inject:[ConfigService] 
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    RouterModule.forRoot(),
    UserModule,
    RoleModule,
    PostsModule,
    AuthModule,
    SubscriberModule,
    CategoryModule,
    QueueConfigModule,
    CacheConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
