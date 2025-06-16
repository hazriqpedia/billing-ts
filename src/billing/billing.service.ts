import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billing } from './billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing)
    private billingRepo: Repository<Billing>,
  ) {}

  findAll(productCode?: number, location?: string) {
    const where: Partial<Pick<Billing, 'productCode' | 'location'>> = {};

    if (productCode !== undefined) where.productCode = productCode;
    if (location !== undefined) where.location = location;
    return this.billingRepo.find({ where });
  }

  create(dto: CreateBillingDto) {
    const record = this.billingRepo.create(dto);
    return this.billingRepo.save(record);
  }

  async update(productCode: number, dto: UpdateBillingDto) {
    const record = await this.billingRepo.findOneBy({ productCode });
    if (!record) throw new NotFoundException('Record not found');
    Object.assign(record, dto);
    return this.billingRepo.save(record);
  }

  async remove(productCode: number) {
    const record = await this.billingRepo.findOneBy({ productCode });
    if (!record) throw new NotFoundException('Record not found');
    return this.billingRepo.remove(record);
  }
}
