import { Exclude, Expose } from "class-transformer";
import { BaseResponse } from "src/common/response/base.response";
import { ERole } from "src/common/database/types/enum";

@Exclude()
export class UserResponse extends BaseResponse{
    @Expose()
    username:string

    @Expose()
    name:string

    @Expose()
    role?: ERole

    @Expose()
    refreshToken: string

    @Expose()
    isActive:boolean
}