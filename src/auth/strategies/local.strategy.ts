import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local'
import { AuthService } from "../service/auth.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super()
    }

    async validate(email:string,password:string):Promise<any>{
        const user = await this.authService.validateUser(email,password)
        if(!user) {throw new UnauthorizedException({message:'local'})}
        if(user.isActive === false){throw new BadRequestException("Account is not activate")}
        return user
    }
    
}