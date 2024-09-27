import { Module } from '@nestjs/common';
import { PostsModule } from 'src/module/post/post.module';
import { PostAdminController } from 'src/module/post/controller/post.admin.controller';
import { CategoryModule } from 'src/module/category/category.module';
import { UserAdminController } from 'src/module/user/controller/user.admin.controller';
import { UserModule } from 'src/module/user/user.module';
import { CategoryAdminController } from 'src/module/category/controller/category.admin.controller';

@Module({
  controllers: [
    UserAdminController,
    PostAdminController,
    CategoryAdminController
  ],
  providers: [],
  exports: [],
  imports: [CategoryModule, PostsModule, UserModule],
})
export class RoutesAdminModule {}