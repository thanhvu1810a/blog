import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Base } from 'src/common/database/schema/base.schema';
import { defaultSchemaOptions } from 'src/common/utils/object.util';
import { User } from 'src/user/schema/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema(defaultSchemaOptions)
export class Token extends Base {
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