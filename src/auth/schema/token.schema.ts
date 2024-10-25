import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { defaultSchemaOptions } from 'src/common/utils/object.util';
import { User } from 'src/module/user/schema/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema(defaultSchemaOptions)
export class Token {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  scope: string;

  @Prop()
  access_token: string;

  @Prop()
  access_token_expires_at: Date;

  @Prop()
  refresh_token: string;

  @Prop()
  refresh_token_expires_at: Date;
}

const TokenSchema = SchemaFactory.createForClass(Token);

export { TokenSchema };