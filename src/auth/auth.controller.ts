import { Body, Controller, Get, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { CodeAuthDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorator/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService:MailerService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@ReqAuthUser() user) {
    //console.log(req.user)
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  //@Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('handleRegister')
  async handleRegister(@Body() register:CreateAuthDto) {
    return await this.authService.handleRegister(register);
  }

  @Public()
  @Post('active')
  async activeCode(@Body() codeDto:CodeAuthDto){
    return await this.authService.activeCode(codeDto)
  }

  @Public()
  @Post('retry-active')
  async retryActiveCode(@Body("email") email:any){
    return await this.authService.retryActiveCode(email)
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Body() body) {
    return await this.authService.veryifyUserRefreshToken(body.refreshToken,body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto:ChangePasswordDto,@Req() req){
    return await this.authService.changPassword(req.user._id,changePasswordDto.oldPassword,changePasswordDto.newPassword)
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
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
  async logout(@Req() req: any) {
    await this.authService.logout(req.user);
    return {
      statusCode: 200,
    };
  }
}