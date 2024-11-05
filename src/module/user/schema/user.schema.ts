import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { ERole } from "src/common/database/types/enum";
import { Post } from "src/module/post/schema/post.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop({unique:true})
    username: string;

    @Prop()
    password: string;

    @Prop({ default: 0 })
    role: ERole;

    @Prop({ default: false })
    isActive: boolean;

    @Prop()
    codeId: string;

    @Prop()
    codeExpired: Date;

    @Prop()
    refreshToken:string

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'Blog' })
    blogs: Post[];

}

export const UserSchema = SchemaFactory.createForClass(User);