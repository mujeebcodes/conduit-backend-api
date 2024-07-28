import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.profileService.getProfile(username.toLocaleLowerCase());
  }
}
