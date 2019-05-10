import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(
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

}
