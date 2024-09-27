import { Exclude, Expose } from "class-transformer";
import { BaseResponse } from "src/common/response/base.response";
import { ERole } from "src/enum";

@Exclude()
export class UserResponse extends BaseResponse{
    @Expose()
    email:string

    @Expose()
    name:string

    @Expose()
    role?: ERole

    @Expose()
    refreshToken: string

    @Expose()
    isActive:boolean
}