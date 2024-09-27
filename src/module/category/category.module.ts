import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schema/category.schema";
import { UserModule } from "src/module/user/user.module";

@Module({
    imports: [
      MongooseModule.forFeature([
        {name: Category.name,schema: CategorySchema,},
      ]),
      UserModule,
    ],
    controllers: [],
    providers: [CategoryService],
    exports:[CategoryService]
  })
  export class CategoryModule {}