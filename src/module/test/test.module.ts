import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestSchema } from "./schema/test.schema";
import { UserModule } from "src/module/user/user.module";

@Module({
    imports: [
      MongooseModule.forFeature([
        {name: Test.name,schema: TestSchema,},
      ]),
      UserModule,
    ],
    controllers: [],
    providers: [CategoryService],
    exports:[CategoryService]
  })
  export class TestModule {}