import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Injectable, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';
import { AuthUser } from 'src/auth/types/auth.type';

@Controller('post')
@ApiTags('Posts')
@ApiBearerAuth('token')
export class PostsController {
  constructor(
    private readonly postsRepository: PostsService,
    private readonly postService:PostsService,
    //@Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}


    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createPost(@ReqAuthUser() user: AuthUser, @Body() post: CreatePostDto) {
      return this.postService.createPost(user, post);
    }
  
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async replacePost(@ReqAuthUser() user:AuthUser, @Body() post: UpdatePostDto) {
    return this.postService.update(user, post);
  }

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return true;
  }


}