import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { BaseFilterParamDto } from 'src/common/database/dtos/base-filter.dto';

export class FilterCategoryDto extends BaseFilterParamDto {}