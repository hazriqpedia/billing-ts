import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Billing } from './billing.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';

const mockBillingUser: User = {
  id: 99,
  email: 'demo@mail.com',
  firstName: 'Demo',
  lastName: 'User',
  photo: 'https://img.com/photo.jpg',
  billings: [],
};

const mockBillingRecord: Billing = {
  id: 1,
  productCode: 4000,
  location: 'West Malaysia',
  premiumPaid: 500.5,
  user: mockBillingUser,
};

describe('BillingService', () => {
  let service: BillingService;
  let repo: jest.Mocked<Repository<Billing>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: getRepositoryToken(Billing),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    repo = module.get(getRepositoryToken(Billing));
  });

  it('should return all records', async () => {
    repo.find.mockResolvedValue([mockBillingRecord]);
    const result = await service.findAll();
    expect(result).toEqual([mockBillingRecord]);
  });

  it('should filter by productCode and location', async () => {
    repo.find.mockResolvedValue([mockBillingRecord]);
    const result = await service.findAll(4000, 'West Malaysia');
    expect(result).toEqual([mockBillingRecord]);
    expect(repo.find).toHaveBeenCalledWith({
      where: { productCode: 4000, location: 'West Malaysia' },
    });
  });

  it('should create a new record', async () => {
    repo.create.mockReturnValue(mockBillingRecord);
    repo.save.mockResolvedValue(mockBillingRecord);
    const result = await service.create(
      {
        productCode: 4000,
        location: 'West Malaysia',
        premiumPaid: 500.5,
      },
      mockBillingUser,
    );
    expect(result).toEqual(mockBillingRecord);
  });

  it('should update a record', async () => {
    repo.findOne.mockResolvedValue(mockBillingRecord);
    repo.save.mockResolvedValue({ ...mockBillingRecord, premiumPaid: 600.0 });

    const result = await service.update(
      4000,
      {
        location: 'West Malaysia',
        premiumPaid: 600.0,
      },
      mockBillingUser,
    );

    expect(result.premiumPaid).toEqual(600.0);
  });

  it('should throw error if updating non-existing record or wrong user', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(
      service.update(
        9999,
        {
          location: 'East Malaysia',
          premiumPaid: 100.0,
        },
        mockBillingUser,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a record', async () => {
    repo.findOne.mockResolvedValue(mockBillingRecord);
    repo.remove.mockResolvedValue(mockBillingRecord);

    const result = await service.remove(4000, mockBillingUser);
    expect(result).toEqual(mockBillingRecord);
  });
});
