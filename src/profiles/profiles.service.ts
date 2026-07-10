import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {
  private profiles = [
    {
      id: 1,
      name: 'Brianna Watts',
      description: 'Looking for someone to merge with my heart',
    },
    {
      id: 2,
      name: 'Brianna Watts',
      description: 'Looking for someone to merge with my heart',
    },
    {
      id: 3,
      name: 'Brianna Watts',
      description: 'Looking for someone to merge with my heart',
    },
  ];

  findAll() {
    return this.profiles;
  }

  findOneByID(id: string) {
    return this.profiles.find((el) => el.id.toString() === id);
  }

  createNew(createProfileDto: CreateProfileDto) {
    const latestID = this.profiles.length;

    const createdProfile = {
      id: latestID + 1,
      ...createProfileDto,
    };

    this.profiles.push(createdProfile);
    return createdProfile;
  }
}
