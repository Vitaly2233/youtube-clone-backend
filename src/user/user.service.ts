import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { RegisterRequestDto } from 'src/auth/dto/register-request.dto';
import { UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {}

  async create({
    username,
    password,
  }: RegisterRequestDto): Promise<UserDocument> {
    const newUser: UserDocument = new this.userModel({
      username,
      password,
    });
    await newUser.save();
    return newUser;
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username });
  }
  async findById(id) {
    return this.userModel.findById(id);
  }

  async updateOne(
    _id: string | Types._ObjectId,
    updateData: UpdateQuery<UserDocument>,
  ) {
    return this.userModel.updateOne({ _id }, updateData);
  }

  async updateByIds(
    ids: Types._ObjectId[],
    updateData: UpdateQuery<UserDocument>,
  ) {
    return this.userModel.updateMany({ _id: { $in: ids } }, updateData);
  }
}
