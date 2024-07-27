import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UsersService) {}

  @Post()
  async createUser(@Body('user') createUserDto: CreateUserDto) {
    return this.UserService.createUser(createUserDto);
  }
}
