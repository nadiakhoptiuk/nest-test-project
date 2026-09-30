import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportRequestsService } from './support-requests.service';
import { SupportRequest } from './entities/support-request.entity';

describe('SupportRequestsService', () => {
  let service: SupportRequestsService;
  let repository: Repository<SupportRequest>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupportRequestsService,
        {
          provide: getRepositoryToken(SupportRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SupportRequestsService>(SupportRequestsService);
    repository = module.get<Repository<SupportRequest>>(
      getRepositoryToken(SupportRequest),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
