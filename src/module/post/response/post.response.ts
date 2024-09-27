import { Exclude, Expose, Type } from 'class-transformer';
import { BaseResponse } from 'src/common/response/base.response';
import { CategoryResponse } from 'src/module/category/response/category.response';
import { UserResponse } from 'src/module/user/response/user.response';

@Exclude()
export class PostResponse extends BaseResponse {
  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CategoryResponse)
  category: CategoryResponse;

  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;
}