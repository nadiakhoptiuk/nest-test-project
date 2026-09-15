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
  NotFoundException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '@/roles/roles.guard';
import { UserRole } from '@/users/entities/user.entity';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.profilesService.findOneByID(id);
    } catch (error: any) {
      throw new NotFoundException(error?.message || '');
    }

    // throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    // throw new NotFoundException();
  }

  // POST /profiles
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.createNew(createProfileDto);
  }

  // PUT /profiles/:id
  @Put(':id')
  updateDescription(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateOne(id, updateProfileDto);
  }

  // DELETE /profiles/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.removeOne(id);
  }
}
