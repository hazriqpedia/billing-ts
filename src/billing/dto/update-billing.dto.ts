import { IsNumber, IsString } from 'class-validator';

export class UpdateBillingDto {
  @IsString()
  location: string;

  @IsNumber()
  premiumPaid: number;
}
