import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


  export class CreateUserDto {
    @IsNotEmpty() username: string;
    @IsNotEmpty() name: string;
    @IsNotEmpty() password: string;
  }
  
  export class LoginUserDto {
    @IsNotEmpty() 
    @IsEmail()
    username: string;
    
    @IsNotEmpty() password: string;
  }

  export class ForgotPasswordDto {
    @IsEmail()
    username: string;
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

    @IsNotEmpty({ message: "_id cannot be empty" })
    username: string;

    @IsNotEmpty({ message: "code cannot be empty" })
    code: string;

}
