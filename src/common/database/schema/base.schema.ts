import { Prop } from '@nestjs/mongoose';

export class Base {
  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}