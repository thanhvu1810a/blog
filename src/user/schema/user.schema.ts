import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Post } from "src/post/schema/post.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ default: "USERS" })
    role: string;

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