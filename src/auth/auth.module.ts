import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/module/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from './schema/reset-token.schema';
import { MailService } from './service/mail.service';
import { Token, TokenSchema } from './schema/token.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/module/user/schema/user.schema';

@Module({
  imports: [
    UserModule,PassportModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject:[ConfigService],
      imports:[ConfigModule],
      useFactory:async(configService:ConfigService)=>({
        global:true,
        secret: configService.get<string>('auth.jwt.accessSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.jwt.accessLifeTime') },
      })
      
    }),
    MongooseModule.forFeature([{name: ResetToken.name,schema: ResetTokenSchema}]),
      MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy,JwtRefreshStrategy,MailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
