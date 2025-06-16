// import { Test, TestingModule } from '@nestjs/testing';
// import { BillingService } from './billing.service';

// describe('BillingService', () => {
//   let service: BillingService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [BillingService],
//     }).compile();

//     service = module.get<BillingService>(BillingService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Billing } from './billing.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockBillingRecord = {
  id: 1,
  productCode: 4000,
  location: 'West Malaysia',
  premiumPaid: 500.5,
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
            findOneBy: jest.fn(),
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
    repo.create.mockReturnValue(mockBillingRecord as any);
    repo.save.mockResolvedValue(mockBillingRecord as any);

    const result = await service.create({
      productCode: 4000,
      location: 'West Malaysia',
      premiumPaid: 500.5,
    });

    expect(result).toEqual(mockBillingRecord);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should update a record', async () => {
    repo.findOneBy.mockResolvedValue({ ...mockBillingRecord });
    repo.save.mockResolvedValue({ ...mockBillingRecord, premiumPaid: 600.0 });

    const result = await service.update(4000, {
      location: 'West Malaysia',
      premiumPaid: 600.0,
    });

    expect(result.premiumPaid).toEqual(600.0);
  });

  it('should throw error if updating non-existing record', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(9999, {
        location: 'East Malaysia',
        premiumPaid: 100.0,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete a record', async () => {
    repo.findOneBy.mockResolvedValue(mockBillingRecord as any);
    repo.remove.mockResolvedValue(mockBillingRecord as any);

    const result = await service.remove(4000);
    expect(result).toEqual(mockBillingRecord);
  });
});
