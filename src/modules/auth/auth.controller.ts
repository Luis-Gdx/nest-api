import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from '../users/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        try {
            const { user, token } = await this.authService.login(loginUserDto);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'user not found' });
            }
            return res.status(HttpStatus.OK).json({ user, token });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    }

}
