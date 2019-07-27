import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from './../../guards/roles.guard';
import { LoginUserDto, UserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) { }

    @Post()
    async create(@Body() userDto: UserDto) {
        try {
            return await this.usersService.create(userDto);
        } catch (error) {
            return error;
        }
    }

    @Get()
    @UseGuards(AuthGuard())
    async findAll() {
        return await this.usersService.findAll();
    }

    @Get('get-token')
    @UseGuards(AuthGuard())
    async getToken(@Req() req: Request) {
        const { user } = req as any;
        const token = await this.authService.getToken(user.id);
        return { token };
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    @Roles('admin')
    @UseGuards(RolesGuard)
    async findById(@Param('id') id: string, @Req() req: Request) {
        return await this.usersService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userDto: UserDto) {
        return await this.usersService.update(id, userDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.usersService.delete(id);
    }

    @Post('signin')
    async register(@Body() userDto: UserDto) {
        try {
            const data = await this.authService.signIn(userDto);
            return data;
        } catch (error) {
            return error;
        }
    }

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
