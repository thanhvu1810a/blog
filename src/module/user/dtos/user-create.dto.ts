import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEnumValue } from 'src/common/decorator/enum-value.decorator';
import { ERole } from 'src/enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.toString()?.trim()?.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnumValue(ERole)
  role:ERole;
}