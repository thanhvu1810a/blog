import mongoose, {  HydratedDocument } from 'mongoose';
import { Post } from 'src/module/post/schema/post.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = HydratedDocument<Category>

@Schema({ timestamps: true })
export class Category{
  
  @Prop({unique:true})
  title:String

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  posts:Post
} 

export const CategorySchema = SchemaFactory.createForClass(Category);
