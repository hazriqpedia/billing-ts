import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Billing } from '../billing/billing.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  photo: string;

  @OneToMany(() => Billing, (billing) => billing.user)
  billings: Billing[];
}
