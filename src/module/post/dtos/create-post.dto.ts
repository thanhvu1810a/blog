import {
    IsMongoId,
    IsNotEmpty,
    IsString,
    MaxLength,
  } from 'class-validator';

  
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
    categories: string;

    
    user: string;
  }