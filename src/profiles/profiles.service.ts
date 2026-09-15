import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  findOneByID(id: number) {
    const matchedProfile = this.profiles.find((el) => el.id === id);

    if (!matchedProfile) {
      throw new Error();
      // throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    return matchedProfile;
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

  updateOne(id: number, updateProfileDto: UpdateProfileDto) {
    const matchedProfile = this.profiles.find((el) => el.id === id);

    if (!matchedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    matchedProfile.description = updateProfileDto.description;

    return matchedProfile;
  }

  removeOne(id: number) {
    const neededProfileIdx = this.profiles.findIndex(
      (profile) => profile.id === id,
    );

    if (neededProfileIdx === -1) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    this.profiles.splice(neededProfileIdx, 1);

    return { success: `Profile with ID ${id} was deleted` };
  }
}
