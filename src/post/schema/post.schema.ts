import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Category } from 'src/category/schema/category.schema';
import mongoose from 'mongoose';
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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user:User

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Category' }])
  categories: [Category]
}
export const PostSchema = SchemaFactory.createForClass(Post);

// export {PostSchema}



// const PostSchema = new Schema(
//   {
//     title: String,
//     description: String,
//     content: String,
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     tags: [String],
//     numbers: [Number],
//     categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
//     // created_at: { type: Date, required: true, default: Date.now },
//     test:String
//   },
//   {
//     timestamps: true,
//     // timestamps: {
//     //   createdAt: 'created_at',
//     //   updatedAt: 'updated_at',
//     // },
//     collection: 'posts',
//   },
// );

// export { PostSchema };

// export interface Post extends Document {
//   title: string;
//   description: string;
//   content: string;
//   user: User;
//   tags: [string];
//   numbers: [number];
//   categories: [Category];
//   test:string
// }