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
import { LoginUserDto } from './dto/LoginUserDto';

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

  async login(data: LoginUserDto) {
    const errorResponse = { errors: {} };

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!existingUser) {
      errorResponse.errors['credentials'] = 'are invalid';
      throw new HttpException(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    const correctPassword = await bcrypt.compare(
      data.password,
      existingUser.password,
    );

    if (!correctPassword) {
      errorResponse.errors['credentials'] = 'are invalid';
      throw new HttpException(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    delete existingUser.password;
    return this.buildUserResponse(existingUser);
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
