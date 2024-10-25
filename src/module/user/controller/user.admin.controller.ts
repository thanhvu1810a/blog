import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "../user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "../schema/user.schema";
import { FilterUserDto } from "../dtos/user-filter.dto";
import { ValidateMongoId } from "src/common/utils/validate.util";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Controller('user')
@ApiTags('Users')
@ApiBearerAuth('accessToken')
export class UserAdminController{
    constructor(private userService:UserService,
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('getall')
    @HttpCode(HttpStatus.OK)
    async getAll(@Query() param:FilterUserDto) {
    return await this.userService.findAll(param);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id',ValidateMongoId) id:string){
        return await this.userService.findByID(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(@Body() body:any,):Promise<User>{
       return await this.userService.updateUser(body)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id',ValidateMongoId) id:string):Promise<void>{
        await this.userService.delete(id)
    }

}