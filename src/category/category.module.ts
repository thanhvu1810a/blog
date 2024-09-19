import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schema/category.schema";
import { UserModule } from "src/user/user.module";
import { Post, PostSchema } from "src/post/schema/post.schema";

@Module({
    imports: [
      MongooseModule.forFeature([
        {name: Category.name,schema: CategorySchema,},
        {name: Post.name,schema: PostSchema,}
      ]),
      UserModule,
      // CacheModule.register({
      //     store:redisStore,
      //     host:'127.0.0.1',
      //     port:6379,
      //     isGlobal:true
      //   }),
  
      // CacheModule.registerAsync({
      //   imports:[ConfigModule],
      //   inject:[ConfigService],
      //   useFactory: async(configService: ConfigService) => ({
      //     // isGlobal: true,
      //     store: redisStore,
      //     host: configService.get<string>('REDIS_HOST'),
      //     port: configService.get<number>('REDIS_PORT'),
      //     username: configService.get<string>('REDIS_USERNAME'),
      //     password: configService.get<string>('REDIS_PASSWORD'),
      //   }),
      // }),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports:[CategoryService]
  })
  export class CategoryModule {}