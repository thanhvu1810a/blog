import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { BaseResponse } from 'src/common/response/base.response';

@Exclude()
export class CategoryResponse extends BaseResponse{
  @Expose()
  name: string;

  @Expose()
  language: string;
}