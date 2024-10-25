import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumer/email.consumer';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheConfigModule } from 'src/common/cache/cache.module';

@Module({
  imports:[
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    PassportModule,
    BullModule.registerQueue({
      name: 'send-mail',
    }),
    ScheduleModule.forRoot(),
    CacheConfigModule
  ],
  controllers: [],
  providers: [UserService,EmailConsumer],
  exports:[UserService]
})
export class UserModule {}