import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { PostsService } from '../post.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';
import { AuthUser } from 'src/auth/types/auth.type';

@Controller('post')
@ApiTags('Posts')
export class PostPublicController {
  constructor(
    private readonly postService:PostsService,
    ) {}


    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createPost(@ReqAuthUser() user: AuthUser, @Body() post: CreatePostDto) {
      return this.postService.createPost(user, post);
    }
  

  @Get('get/category')
  @HttpCode(HttpStatus.OK)
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }


}