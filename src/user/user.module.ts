import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './schema/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumer/email.consumer';

@Module({
  imports:[
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
    PassportModule
  ],
  controllers: [UserController],
  providers: [UserService,EmailConsumer],
  exports:[UserService]
})
export class UserModule {}