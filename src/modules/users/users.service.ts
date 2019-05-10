import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    create(userDto: UserDto): Promise<User> {
        return new this.userModel(userDto).save();
    }

    findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    findById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    findOneByEmail(email): Promise<User> {
        return this.userModel.findOne({ email }).exec();
    }
    findOne(data): Promise<User> {
        return this.userModel.findOne(data).exec();
    }

    update(id, user): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, { $set: user }, { new: true }).exec();
    }

    delete(id): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }

}
