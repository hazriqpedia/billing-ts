import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billing } from './billing.entity';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { User } from '../user/user.entity';

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

  async create(dto: CreateBillingDto, user: User) {
    const record = this.billingRepo.create({
      productCode: dto.productCode,
      location: dto.location,
      premiumPaid: dto.premiumPaid,
      user, // associate user
    });

    return this.billingRepo.save(record);
  }

  async update(productCode: number, dto: UpdateBillingDto, user: User) {
    const record = await this.billingRepo.findOne({
      where: { productCode },
      relations: ['user'],
    });

    console.log('Expected:', user.id, 'Actual:', record?.user.id);
    if (!record || record.user.id !== user.id) {
      throw new NotFoundException('Record not found or user not authorized');
    }

    Object.assign(record, dto);
    return this.billingRepo.save(record);
  }

  async remove(productCode: number, user: User) {
    const record = await this.billingRepo.findOne({
      where: { productCode },
      relations: ['user'],
    });

    if (!record || record.user.id !== user.id) {
      throw new NotFoundException('Record not found or user not authorized');
    }

    return this.billingRepo.remove(record);
  }
}
