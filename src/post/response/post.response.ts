import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponse } from 'src/common/response/base.response';
import { EStatus } from 'src/enum';
import { CategoryResponse } from 'src/category/response/category.response';
import { UserResponse } from 'src/user/response/user.response';

@Exclude()
export class PostResponse extends BaseResponse {
  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CategoryResponse)
  category: CategoryResponse;

  @Expose()
  @Type(() => UserResponse)
  author: UserResponse;

  @Expose()
  status?: EStatus;
}