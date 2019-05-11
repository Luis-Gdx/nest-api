import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import 'dotenv/config';
import { UserSchema } from 'src/models/user.schema';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secretOrPrivateKey: process.env.KEY }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [
        PassportModule,
        AuthService,
    ],
})
export class AuthModule { }
