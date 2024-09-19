import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

@Exclude()
export class BaseResponse {
  @Expose({ name: '_id' })
  _id: string | number | Types.ObjectId;

  @Expose()
  createdAt?: Date | string;

  @Expose()
  updatedAt?: Date | string;
}