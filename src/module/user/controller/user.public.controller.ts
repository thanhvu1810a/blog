import {  Controller, Get, HttpCode, HttpStatus, Param,  Query, UseGuards } from "@nestjs/common";
import { UserService } from "../user.service";
import { ApiTags } from "@nestjs/swagger";
import { FilterUserDto } from "../dtos/user-filter.dto";

@Controller('user')
@ApiTags('Users')
export class UserPublicController{
    constructor(private userService:UserService){}

    @Get('getall')
    @HttpCode(HttpStatus.OK)
    async getAll(@Query() param:FilterUserDto) {
    return await this.userService.findAll(param);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id:string){
        return await this.userService.findByID(id)
    }
}