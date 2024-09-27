import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/module/user/schema/user.schema';
import { Category } from 'src/module/category/schema/category.schema';
import { defaultSchemaOptions } from 'src/common/utils/object.util';

export type PostDocument = HydratedDocument<Post>

@Schema(defaultSchemaOptions)
export class Post {

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  content:string

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Category' }])
  categories: [Category]

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user:User

}
export const PostSchema = SchemaFactory.createForClass(Post);