import mongoose, {  HydratedDocument, Types } from 'mongoose';
import { Post } from 'src/module/post/schema/post.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TestDocument = HydratedDocument<Test>

@Schema()
export class Test{

  @Prop()
  _id:string;

  @Prop()
  name: string

  @Prop()
  language:string

  @Prop()
  id:string

  @Prop()
  bio:string

  @Prop()
  version:number
} 
const schema = SchemaFactory.createForClass(Test)
schema.index({name:1,_id:1})

export const TestSchema = schema
