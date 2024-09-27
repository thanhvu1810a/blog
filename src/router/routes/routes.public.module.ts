import { Module } from '@nestjs/common';
import { PostsModule } from 'src/module/post/post.module';
import { PostPublicController } from 'src/module/post/controller/post.public.controller';
import { CategoryModule } from 'src/module/category/category.module';
import { UserModule } from 'src/module/user/user.module';
import { UserPublicController } from 'src/module/user/controller/user.public.controller';
import { CategoryPublicController } from 'src/module/category/controller/category.public.controller';

@Module({
  controllers: [
    UserPublicController,
    PostPublicController,
    CategoryPublicController
  ],
  providers: [],
  exports: [],
  imports: [CategoryModule, PostsModule, UserModule],
})
export class RoutesPublicModule {}