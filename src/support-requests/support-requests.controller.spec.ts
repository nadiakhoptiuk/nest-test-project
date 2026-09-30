import { Test, TestingModule } from '@nestjs/testing';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';
import { ApiKeyGuard } from '@/auth/api-key.guard';

describe('SupportRequestsController', () => {
  let controller: SupportRequestsController;
  let service: SupportRequestsService;

  const mockSupportRequestsService = {
    sendMessageToSlack: jest.fn(),
  };

  const mockApiKeyGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestsController],
      providers: [
        {
          provide: SupportRequestsService,
          useValue: mockSupportRequestsService,
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue(mockApiKeyGuard)
      .compile();

    controller = module.get<SupportRequestsController>(
      SupportRequestsController,
    );
    service = module.get<SupportRequestsService>(SupportRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
