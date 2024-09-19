import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
//import { RoleModule } from './common/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './common/database/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './post/post.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CategoryModule } from './category/category.module';
import configs from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest_admin',{
      autoCreate:true
    }),
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
    // BullModule.forRoot({
    //   redis:{
    //     host:'127.0.0.1',
    //     port:6379
    //   }
    // }),
    UserModule,
    //RoleModule,
    PostsModule,
    AuthModule,
    SubscriberModule,
    CategoryModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
