import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { CreateUserDto } from './dtos/user-create.dto';
import { hashPasswordHelper } from 'src/common/utils/help';
import { CodeAuthDto } from 'src/auth/dtos/auth.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './response/user.response';
import { FilterUserDto } from './dtos/user-filter.dto';
import { ListPaginate } from 'src/common/database/types/database.type';
import { wrapPagination } from 'src/common/utils/object.util';
import { UpdateUserDto } from './dtos/user-update.dto';
import { ERole } from 'src/common/database/types/enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('send-mail') private sendMail: Queue,
  ) {}


  async register(registerDto:CreateUserDto):Promise<any>{
    const {name,username,password,role} = registerDto
    const id = uuidv4()
    const isExist = await this._findByEmail(username)
    if(isExist){
      throw new HttpException('USERNAME_IN_USED', HttpStatus.BAD_REQUEST)
    }

    const hashPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name,username,password:hashPassword,
      isActive:false,
      role: role === ERole.admin? ERole.admin : ERole.user,
      codeId:id,
      codeExpired:dayjs().add(5,'minutes')
    })
    
    await this.sendMail.add(
      'register',
      {
        to: user.username,
        name: user?.name??user.username,
        activationCode:id
      },
      {
        removeOnComplete: true,
      },
    );

    return {
      _id:user._id
    }
  }

  async findAll(params: FilterUserDto): Promise<ListPaginate<UserResponse>> {
    const data = await this.userModel
      .find({ name: new RegExp(params.filter, 'i') })
      .limit(params.limit)
      .skip(params.limit * (params.page - 1))
      .sort({
        createdAt: 'asc',
      })
      .exec(); 

    return wrapPagination<UserResponse>(
      plainToInstance(UserResponse, data, {
        excludeExtraneousValues: true,
      }),
      data.length,
      params,
    );
  }

  async findByLogin(username: string,password:string):Promise<any> {
    const user = await this.userModel.findOne({
      username: username,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const is_equal = bcrypt.compareSync(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
    
  }

  async findPassword(id: any): Promise<any> {
    const user = await this.userModel.findOne({_id:id})
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByID(id: any): Promise<UserResponse> {
    const user = await this.userModel.findOne({_id:id})
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(UserResponse, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(input:UpdateUserDto):Promise<User> {
    await this.findByID(input.id);
    return await this.userModel.findByIdAndUpdate(input.id,input);
  }

  async updateToken(id:any,input:UpdateQuery<UpdateUserDto>):Promise<User> {
    return await this.userModel.findByIdAndUpdate(id,input);
  }

  async delete(id:string):Promise<User>{
    await this.findByID(id);
    return await this.userModel.findByIdAndDelete(id)
  }

  async logout(filter:any, update) {
    return await this.userModel.findOneAndUpdate(filter, update);
  }

//ChangeOnAccount
  async handleActive(data: CodeAuthDto): Promise<any> {
    const user = await this.userModel.findOne({
      username: data.username
    })
    if (!user) {
      throw new BadRequestException("The user is not exist")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ username: data.username }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("The code is invalid or has expired")
    }
  }

  async retryActive(username: any): Promise<any> {
    //check email
    const user = await this._findByEmail(username);

    if (!user) {
      throw new BadRequestException("Account does not exist")
    }
    if (user.isActive) {
      throw new BadRequestException("Account has been activated")
    }

    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    await this.sendMail.add(
      'register',
      {
        to: user.username,
        name: user?.name??user.username,
        activationCode:codeId
      },
      {
        removeOnComplete: true,
      },
    );

    return { _id: user._id }
  }


  async _findByEmail(username) {
    return await this.userModel.findOne({
      username: username,
    });
  }

}