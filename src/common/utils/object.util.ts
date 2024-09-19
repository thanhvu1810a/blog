import { SchemaOptions } from '@nestjs/mongoose';
import { ListPaginate, QueryPaginate } from '../database/types/database.type';

export function wrapPagination<T>(
  data: T[],
  totalCount: number,
  paginationCfg: QueryPaginate,
): ListPaginate<T> {
  return {
    data: data,
    total_pages: Math.ceil(totalCount / paginationCfg.limit),
    limit: paginationCfg.limit,
    page: paginationCfg.page,
    total_records: totalCount,
  };
}

export const defaultSchemaOptions: SchemaOptions = {
  id: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
};