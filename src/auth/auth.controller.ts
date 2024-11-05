import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CodeAuthDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from './dtos/auth.dto';
import { AuthService } from './service/auth.service';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ChangePasswordDto } from './dtos/auth.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';
import { RolesGuard } from 'src/common/role/guard/roles.guard';
import { CreateUserDto } from 'src/module/user/dtos/user-create.dto';
import { ExtractJwt } from 'passport-jwt';
import { EAuthType } from 'src/common/database/types/enum';
import { Request } from 'express';
import { AuthToken, AuthUser } from './types/auth.type';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqAuthUser() user:AuthUser):Promise<AuthToken> {
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@ReqAuthUser() user:AuthUser) {
    return user;
  }

  @Public()
  @Post('handleRegister')
  async handleRegister(@Body() register:CreateUserDto) {
    return await this.authService.handleRegister(register);
  }

  @Public()
  @Post('active')
  async activeCode(@Body() codeDto:CodeAuthDto){
    return await this.authService.activeCode(codeDto)
  }

  @Public()
  @Post('retry-active')
  async retryActiveCode(@Body("username") username:any){
    return await this.authService.retryActiveCode(username)
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Public()
  @Post('refresh')
  async refresh(@ReqAuthUser() user) {
    return await this.authService.token(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto:ChangePasswordDto,@Req() req){
    return await this.authService.changPassword(req.user._id,changePasswordDto.oldPassword,changePasswordDto.newPassword)
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.username);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    await this.authService.removeToken(token,EAuthType.refresh);
    return {
      statusCode: 200,
    };
  }
}