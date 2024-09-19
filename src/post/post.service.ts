import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dtos/create-post.dto';
//import { User } from 'src/user/schema/user.schema';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { AuthUser } from 'src/auth/types/auth.type';
import { plainToInstance } from 'class-transformer';
import { PostResponse } from './response/post.response';
import Excel from 'exceljs';
import { Category, CategoryDocument } from 'src/category/schema/category.schema';
import fs from 'fs'
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @Inject('IMPORT_SERVICE') private readonly importService: ClientProxy
  ) {}

  async createPost(input: AuthUser, post: CreatePostDto) {
    post.user = input.id;
    const new_post = await this.postModel.create(post);
    if (post.categories) {
      await this.postModel.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }
    return new_post;
  }

  async findAll(page: number, limit: number, start: string): Promise<any> {
    const count = await this.postModel.countDocuments({});
    const count_page = (count / limit).toFixed();
    const posts = await this.postModel.find(
      {
        _id: {
          $gt: isValidObjectId(start) ? start : '000000000000000000000000',
        },
      },
      null,
      {
        sort: {
          _id: 1,
        },
        skip: (page - 1) * limit,
        limit: Number(limit),
      },
    );
    return { count_page, posts };
  }


  async getById(id: string): Promise<PostResponse> {
    const blog = await this.postModel
      .findOne<PostResponse>({ _id: id })
      .populate({ path: 'category' })
      .populate({ path: 'author' });

    if (!blog) {
      throw new HttpException('POST_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(PostResponse, blog, {
      excludeExtraneousValues: true,
    });
  }


  async getByCategory(category_id: string):Promise<any> {
    return await this.postModel.find({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }


  async deletePost(post_id: any):Promise<void> {
    await this.getById(post_id);
    return await this.postModel.findByIdAndDelete(post_id);
  }

  async update(user: AuthUser,input: UpdatePostDto ): Promise<void> {
    await this.getById(user.id);
    await this.postModel.findByIdAndUpdate(input.id, {
      ...input,
      author: user.id,
    });
  }

  //queues

  // async import(file: Express.Multer.File, loggedUser: AuthUser) {
  //   await this.importQueue.add(
  //     'import-blog',
  //     { file, loggedUser },
  //     {
  //       removeOnComplete: true,
  //     },
  //   );
  // }


  async verifyImport(jobData:{
    file: Express.Multer.File,
    loggedUser: AuthUser
  }) {

    const { file, loggedUser } = jobData;
    const workbook = new Excel.Workbook();
    const a = await workbook.xlsx.readFile('./uploads/'+file.filename);

    const verifyData = this._handleImportData(workbook, loggedUser);

    await this.postModel.insertMany(verifyData).then(() => {
      fs.unlinkSync('./uploads/'+file.filename);
    });
    console.log(a)
  }

  //rabbitmq

  async importRmb(file: Express.Multer.File, loggedUser: AuthUser) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('./uploads/');

    const verifyData = await this._handleImportData(workbook, loggedUser);

    this.importService.emit(
      {
        cmd: 'import-blog',
      },
      {
        verifyData,
      },
    );
    return verifyData
  }

  async _handleImportData(workbook: Excel.Workbook, author: AuthUser) {
    const data: CreatePostDto[] = [];
    workbook.worksheets.forEach((sheet) => {
      const firstRow = sheet.getRow(1);
      if (!firstRow.cellCount) return;
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber == 1) return;
        const values = row.values;
        data.push({
          title: values[1],
          description: values[2],
          categories: values[3],
          content: values[4],
          user: values[5]
        });
      });
    });

    const listCategory = await this.categoryModel
      .find()
      .where('title')
      .in(data.map((d) => d.categories));

    const verifyData = data.map((data) => {
      const findCate = listCategory.find((cate) => cate.title === data.categories);

      if (!findCate) {
        throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.BAD_REQUEST);
      }

      return {
        ...data,
        category: findCate['_id'].toString(),
        author: author?.id,
      };
    });

    return verifyData;
  }

}