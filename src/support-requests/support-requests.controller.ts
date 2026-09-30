import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SupportRequestsService } from './support-requests.service';
import { Public } from '@/auth/public.decorator';
import { ApiKeyGuard } from '@/auth/api-key.guard';

@Controller('support')
export class SupportRequestsController {
  constructor(private readonly supportService: SupportRequestsService) {}

  @Public()
  @UseGuards(ApiKeyGuard)
  @Post('request')
  async createSupportRequest(@Body() body: CreateSupportRequestDto) {
    console.log('BODY', body);
    await this.supportService.createSupportRequest(body);

    return {
      success: true,
    };
  }
}
