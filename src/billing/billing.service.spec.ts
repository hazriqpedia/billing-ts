import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Billing } from './billing.entity';
import { NotFoundException } from '@nestjs/common';

const mockBillingRecord: Billing = {
  id: 1,
  productCode: 4000,
  location: 'West Malaysia',
  premiumPaid: 500.5,
};

describe('BillingService', () => {
  let service: BillingService;
  let repo: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      find: jest.fn().mockResolvedValue([]),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: getRepositoryToken(Billing),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
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
    expect(repo.findOneBy).toHaveBeenCalledWith({ productCode: 4000 });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw error if updating non-existing record', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(
      service.update(9999, {
        location: 'East Malaysia',
        premiumPaid: 100.0,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(repo.findOneBy).toHaveBeenCalledWith({ productCode: 9999 });
  });

  it('should delete a record', async () => {
    repo.findOneBy.mockResolvedValue(mockBillingRecord);
    repo.remove.mockResolvedValue(mockBillingRecord);

    const result = await service.remove(4000);
    expect(result).toEqual(mockBillingRecord);
    expect(repo.findOneBy).toHaveBeenCalledWith({ productCode: 4000 });
    expect(repo.remove).toHaveBeenCalledWith(mockBillingRecord);
  });
});
