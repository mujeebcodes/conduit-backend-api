import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/CreateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(data: CreateUserDto) {
    const errorResponse = { errors: {} };

    const existingEmail = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    const existingUsername = await this.prismaService.user.findUnique({
      where: { username: data.username },
    });

    if (existingEmail) {
      errorResponse.errors['email'] = 'already exists';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (existingUsername) {
      errorResponse.errors['username'] = 'already exists';
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = await this.prismaService.user.create({
      data: { ...data, password: await bcrypt.hash(data.password, 10) },
      select: { email: true, username: true, bio: true, image: true },
    });

    return this.buildUserResponse(newUser);
  }

  generateJWTToken(payload: string) {
    return this.jwtService.sign(payload);
  }

  buildUserResponse(user: {
    username: string;
    email: string;
    bio: string;
    image: string;
  }) {
    return { user: { ...user, token: this.generateJWTToken(user.email) } };
  }
}
