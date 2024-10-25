import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from '../post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { ReqAuthUser } from 'src/common/decorator/request.decorator';
import { AuthUser } from 'src/auth/types/auth.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { ValidateMongoId } from 'src/common/utils/validate.util';

@Controller('post')
@ApiTags('Posts')
@ApiBearerAuth('accessToken')
export class PostAdminController {
  constructor(
    private readonly postService:PostsService,
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
  @HttpCode(HttpStatus.OK)
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id',ValidateMongoId) id: string) {
    await this.postService.deletePost(id);
    return true;
  }

  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerOptions.storage,
    }),
  )
  async import(
    @ReqAuthUser() loggedUser: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.verifyImport({file, loggedUser});
  }


  @Post('rmb/import')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerOptions.storage,
    }),
  )
  async importRmb(
    @ReqAuthUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.importRmb(file, user);
  }

  @Post('bullmq/import')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerOptions.storage,
    }),
  )
  async importBull(
    @ReqAuthUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postService.import(file, user);
  }

}