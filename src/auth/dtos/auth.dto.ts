import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


  export class CreateUserDto {
    @IsNotEmpty() email: string;
    @IsNotEmpty() name: string;
    @IsNotEmpty() password: string;
  }
  
  export class LoginUserDto {
    @IsNotEmpty() email: string;
    @IsNotEmpty() password: string;
  }

  export class ForgotPasswordDto {
    @IsEmail()
    email: string;
  }

  export class ResetPasswordDto {
    @IsString()
    resetToken: string;
  
    @IsString()
    newPassword: string;
  }

  export class ChangePasswordDto {
    @IsString()
    oldPassword: string;
  
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
    newPassword: string;
    }

  export class CodeAuthDto {

    @IsNotEmpty({ message: "_id không được để trống" })
    email: string;

    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

}
