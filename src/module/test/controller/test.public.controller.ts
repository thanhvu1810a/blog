import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query,
  } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
  
  @Controller('test')
  export class CategoryPublicController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getList(@Query() param: FilterCategoryDto) {
    return await this.categoryService.getList(param);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getCategoryById(@Param('id') category_id) {
      return await this.categoryService.getById(category_id);
    }
  }