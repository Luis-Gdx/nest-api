import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/types/user';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(): Promise<string> {
        // In the real-world app you shouldn't expose this method publicly
        // instead, return a token once you verify user credentials
        const user: any = { email: 'user@email.com' };
        return this.jwtService.sign(user);
    }

    async login({ email, password }): Promise<any> {
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
