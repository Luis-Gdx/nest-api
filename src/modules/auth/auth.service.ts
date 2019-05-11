import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { LoginUserDto, UserDto } from '../users/users.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(userDto: UserDto): Promise<{ user: User, token: string }> {
        const user: User = (await new this.userModel(userDto).save()).toJSON();
        delete user.password;
        const token = this.jwtService.sign(user);
        return { user, token };
    }

    async login({ email, password }: LoginUserDto): Promise<any> {
        email = email.toLowerCase();
        let user = await this.userModel.findOne({ email }).select('+password').exec();
        if (!user) {
            return false;
        }
        user = user.toJSON();
        if ((await bcrypt.compare(password, user.password))) {
            delete user.password;
            const token = this.jwtService.sign(user);
            return { user, token };
        }
    }

    async validateUser(payload: any): Promise<any> {
        return await this.getUserByEmail(payload.email);
    }

    getUserByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
}
