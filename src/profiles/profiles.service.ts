import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from 'src/types/profileResponse';

@Injectable()
export class ProfilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(username: string) {
    const errorResponse = { errors: {} };
    const profile = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!profile) {
      errorResponse.errors['user'] = 'not found';
      throw new HttpException(errorResponse, HttpStatus.NOT_FOUND);
    }
    return this.buildProfileResponse(profile);
  }

  buildProfileResponse(profile: User, following: boolean = false): Profile {
    return {
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following,
      },
    };
  }
}
