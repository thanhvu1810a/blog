import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Types } from 'mongoose';

export class BaseFilterParamDto {

  @IsOptional()
  @IsMongoId()
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page = 1;


  @IsOptional()
  @IsISO8601()
  date_from: Date;

  @IsOptional()
  @IsISO8601()
  // @CheckDateRange(30, 'date_from') //TODO
  date_to: Date;
}