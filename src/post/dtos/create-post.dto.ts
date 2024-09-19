import {
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
  } from 'class-validator';
  import { EStatus } from 'src/enum';
  
  export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    content: string;
  
    @IsNotEmpty()
    @IsMongoId()
    @IsString()
    categories: string;

    @IsNotEmpty()
    @IsMongoId()
    @IsString()
    user: string;
  }