import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    return this.UserService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body('user') loginUserDto: LoginUserDto) {
    return this.UserService.login(loginUserDto);
  }
}
