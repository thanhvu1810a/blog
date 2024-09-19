import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "../user.service";
import { Public } from "src/auth/decorator/public.decorator";
import { Roles } from "src/common/role/decorator/roles.decorator";
import { Role } from "src/common/role/enums/role.enum";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationParams } from "src/common/paginationParams";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "../schema/user.schema";
import { FilterUserDto } from "../dtos/user-filter.dto";

@Controller('user')
@ApiTags('Users')
export class UserController{
    constructor(private userService:UserService){}

    @UseGuards(JwtAuthGuard)
    @Get('getall')
    @HttpCode(HttpStatus.OK)
    async getAll(@Query() param:FilterUserDto) {
    return await this.userService.findAll(param);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id:string){
        return await this.userService.findByID(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateUser(@Body() body:any,):Promise<User>{
       return await this.userService.update1(body)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id:string):Promise<void>{
        await this.userService.delete(id)
    }
}