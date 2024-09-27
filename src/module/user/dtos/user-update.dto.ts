import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './user-create.dto';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(60)
  new_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(60)
  current_password: string;
}