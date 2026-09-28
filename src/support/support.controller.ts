import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SupportService } from './support.service';
import { Public } from '@/auth/public.decorator';
import { ApiKeyGuard } from '@/auth/api-key.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Public()
  @UseGuards(ApiKeyGuard)
  @Post('request')
  async createSupportRequest(@Body() body: CreateSupportRequestDto) {
    console.log('BODY', body);
    await this.supportService.sendMessageToSlack(body);

    return {
      success: true,
    };
  }
}
