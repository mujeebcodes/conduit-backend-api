import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginUserDto } from './dto/LoginUserDto';
import { AuthGuard } from './guards/AuthGuard';
import { User } from './decorators/currentUser';
import { User as UserType } from '@prisma/client';

@Controller('api')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    return this.UserService.createUser(createUserDto);
  }

  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto) {
    return this.UserService.login(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  getCurrentUser(@User() currentUser: UserType) {
    return this.UserService.buildUserResponse(currentUser);
  }
}
