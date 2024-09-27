import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
  } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { FilterCategoryDto } from '../dtos/filter-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
@Controller('category')
@ApiTags('Categories')
@ApiBearerAuth('accessToken')
  export class CategoryAdminController {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    async getList(@Query() param: FilterCategoryDto) {
    return await this.categoryService.getList(param);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
      return await this.categoryService.create(createCategoryDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getCategoryById(@Param('id') category_id) {
      return await this.categoryService.getById(category_id);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(@Body() body: UpdateCategoryDto): Promise<void> {
      return this.categoryService.update(body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
      return this.categoryService.delete(id);
    }
  }