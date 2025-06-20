import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UserService } from '../user/user.service';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  photo: 'https://img.com/photo.jpg',
  billings: [],
};

const mockUserService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
};

describe('BillingController', () => {
  let controller: BillingController;
  // let service: BillingService;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        {
          provide: BillingService,
          useValue: mockService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    // service = module.get<BillingService>(BillingService);
  });

  it('should get all records', async () => {
    const records = [{ id: 1, productCode: 4000 }];
    mockService.findAll.mockResolvedValue(records);
    const result = await controller.getAll({});
    expect(result).toEqual(records);
  });

  it('should create a new record', async () => {
    const dto: CreateBillingDto = {
      productCode: 1234,
      location: 'East Malaysia',
      premiumPaid: 100.5,
    };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
  });
});
