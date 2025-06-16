import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('BILLING_RECORDS')
export class Billing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: number;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2 })
  premiumPaid: number;

  @ManyToOne(() => User, (user) => user.billings, { eager: true })
  user: User;
}
