import {
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CategoryResponse } from './response/category.response';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { FilterCategoryDto } from './dtos/filter-category.dto';
import { ListPaginate } from 'src/common/database/types/database.type';
import { wrapPagination } from 'src/common/utils/object.util';
  
  @Injectable()
  export class CategoryService {
    constructor(
      @InjectModel(Category.name) private categoryModel: Model<Category>,
    ) {}
  
    async create(input: CreateCategoryDto) {
      const isExist = await this.categoryModel.findOne({title:input.title} );
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

    async getList(
      params: FilterCategoryDto,
    ): Promise<ListPaginate<CategoryResponse>> {
      const data = await this.categoryModel
        .find({ name: new RegExp(params.filter, 'i') })
        .limit(params.limit)
        .skip(params.limit * (params.page - 1))
        .sort({
          created_at: 'asc',
        })
        .exec();
  
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