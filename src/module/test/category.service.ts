import {
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './schema/test.schema';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from './response/category.response';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FilterCategoryDto } from './dtos/filter-category.dto';
import { ListPaginate } from 'src/common/database/types/database.type';
import { wrapPagination } from 'src/common/utils/object.util';
import { ObjectId } from 'typeorm';
  
  @Injectable()
  export class CategoryService {
    constructor(
      @InjectModel(Test.name) private categoryModel: Model<TestDocument>,
    ) {}
  
    async create(input: CreateCategoryDto) {
      const isExist = await this.categoryModel.findOne({name:input.name} );
      console.log(isExist)
      if (isExist) {
      throw new HttpException('CATEGORY_IN_USED', HttpStatus.BAD_REQUEST);
      }
      return await this.categoryModel.create(input);
    }

    async getById(id: string): Promise<CategoryResponse> {
      const category = await this.categoryModel.findOne({ _id: id });
      console.log(category)
      if (!category) {
        throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
      }
  
      return plainToInstance(CategoryResponse, category, {
        excludeExtraneousValues: true,
      });
    }

// "_id": "6710a590e219d13829683869",
//             "name": "Preeti Rajdan",
//             "language": "Hindi
// "_id": "6710a590e219d1382968386a",
//             "name": "Sanjay Trivedi",
//             "language": "Hindi"

    async getList(
      params: FilterCategoryDto,
    ): Promise<ListPaginate<CategoryResponse>> {
      const data = await this.categoryModel
        .find( {
         $or: [
           { name: {$gt:params.filter} },
          {name:params.filter,_id: { $gt: params._id }}]   
        } )
        .limit(params.limit)
        .sort({
          name: 1,
          _id:1
        })
        .exec();
        // .find()
      // .limit(10)
      // .sort({
      //      name: 1,
      //      _id:1
      //     })
      return wrapPagination<CategoryResponse>(
        plainToInstance(CategoryResponse, data, {
          excludeExtraneousValues: true,
        }),
        data.length,
        params,
      );
    }

    async update(input: UpdateCategoryDto): Promise<void> {
      await this.getById(input._id);
      await this.categoryModel.findByIdAndUpdate(input._id, input);
    }
  
    async delete(id: string): Promise<void> {
      await this.getById(id);
      await this.categoryModel.findByIdAndDelete(id);
    }
  }