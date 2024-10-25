import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  language:string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  id:string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  bio:string

  @IsNotEmpty()
  @MaxLength(255)
  version:number
}