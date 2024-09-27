import { Exclude, Expose } from 'class-transformer';
import { BaseResponse } from 'src/common/response/base.response';

@Exclude()
export class CategoryResponse extends BaseResponse {
  @Expose()
  title: string;
}