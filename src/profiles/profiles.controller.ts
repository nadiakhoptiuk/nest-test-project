import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  // GET /profiles
  @Get()
  findAllAge() {
    return this.profilesService.findAll();
  }

  // GET /profiles/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOneByID(id);
  }

  // POST /profiles
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createNew(createProfileDto);
  }

  // PUT /profiles/:id
  @Put(':id')
  updateDescription(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return {
      id,
      ...updateProfileDto,
    };
  }

  // DELETE /profiles/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {}
}
