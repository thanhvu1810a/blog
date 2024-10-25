import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { PostsService } from '../post.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';
import { AuthUser } from 'src/auth/types/auth.type';
import { ValidateMongoId } from 'src/common/utils/validate.util';

@Controller('post')
@ApiTags('Posts')
export class PostPublicController {
  constructor(
    private readonly postService:PostsService,
    ) {}

  @Get('get/category')
  @HttpCode(HttpStatus.OK)
  async getByCategory(@Query('category_id',ValidateMongoId) category_id:string) {
    return await this.postService.getByCategory(category_id);
  }
}