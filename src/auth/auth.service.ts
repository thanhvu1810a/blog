import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CodeAuthDto, CreateUserDto, LoginUserDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { ExtractJwt } from 'passport-jwt';
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;
import { CreateAuthDto } from './dtos/create-auth.dto'; 
import { compare, hash } from 'bcrypt';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from './mail.service';
import { nanoid } from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResetToken } from './schema/reset-token.schema';
import { EAuthType } from 'src/enum';
import { Token, TokenDocument } from './schema/token.schema';
import dayjs = require('dayjs');
import { ConfigService } from '@nestjs/config';
import { AuthToken, AuthUser } from './types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}


  async handleRegister(registerDto:CreateAuthDto){
    return await this.userService.register(registerDto)
  }

  async activeCode(data:CodeAuthDto){
    return await this.userService.handleActive(data)
  }

  async retryActiveCode(email:any){
    return await this.userService.retryActive(email)
  }

  async login(user: AuthUser):Promise<AuthToken> {
    const payload = {email: user.email, name:user.name, _id: user.id};
    //const user_data = await this.userService.findByLogin(user.email,user.password)
    const token = await this._createToken(payload);
    const refreshToken = token.refreshToken
    const accessToken = token.accessToken
    const accessTokenExpiresAt = token.expiresAt
    const refreshTokenExpiresAt = token.expiresAtRefresh

    Object.assign(token, {
      user: user.id,
      access_token: token.accessToken,
      access_token_expires_at: token.expiresAt,
      refresh_token: token.refreshToken,
      refresh_token_expires_at: token.expiresAtRefresh,
    });

    await this.userService.update(
      { _id: user.id },
      { $set: { refreshToken: await hash(refreshToken, 10) } },
    );

    await this.tokenModel.deleteMany({ user: user.id });
    await new this.tokenModel(token).save();

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(email:string,password:string) {
    const user = await this.userService.findByLogin(email,password);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async _createToken(
    { email,name,_id }
  ) {
    const now = dayjs().unix();
    const expireAtRefresh = Number(this.configService.get<number>('auth.jwt.refreshLifeTime'))
    const expireAt = Number(this.configService.get<number>('auth.jwt.accessLifeTime'))

    const accessToken = this.jwtService.sign(
      {email,name,_id},
      {
        secret: this.configService.get<string>('auth.jwt.accessSecret'),
        expiresIn: expireAt + now,
      },
    );
    
    const refreshToken = this.jwtService.sign(
      { email,name,_id },
      {
          secret: this.configService.get<string>('auth.jwt.refreshSecret'),
          expiresIn: expireAtRefresh + now,
      },
    );
    
      return {
        expiresAt:  new Date(( expireAt+ now)*1000),
        accessToken,
        refreshToken,
        expiresAtRefresh: new Date( (now + expireAtRefresh)*1000),
      };
    
  }

  async veryifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.userService.getUser({ _id: userId });
      const authenticated = await compare(refreshToken, user.refreshToken);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      const {email,name,_id} = user
      const accessToken = this.jwtService.sign(
        {email,name,_id,}
      );
      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }

  async removeToken(token: string, type: EAuthType): Promise<void> {
    await this.tokenModel.deleteOne({
      [type === EAuthType.access ? 'access_token' : 'refresh_token']: token,
    });
  }

  async changPassword(userId,oldPassword,newPassword: string){
    const user = await this.userService.findID(userId)
    if(!user){throw new NotFoundException('User not found')}

    const comparePass = await bcrypt.compare(oldPassword,user.password)
    if(!comparePass){throw new UnauthorizedException('Wrong credential')}

    const newPass = await bcrypt.hash(newPassword,10)
    user.password = newPass
    await user.save()
  }

  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.userService._findByEmail( email );

    if (user) {
      //If user exists, generate password reset link
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
      //Send the link to the user by email
      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'If this user exists, they will receive an email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    //Find a valid reset token document
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    //Change user password (MAKE SURE TO HASH!!)
    const user = await this.userService.findID(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async logout(user: any) {
    await this.userService.logout(
      { email: user.username },
      { refreshToken: null },
    );
    return user
  }

}