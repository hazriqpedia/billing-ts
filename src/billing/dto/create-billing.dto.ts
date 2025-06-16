import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillingDto {
  @IsNumber()
  @ApiProperty({ example: 4000, description: 'Product code of the insurance' })
  productCode: number;

  @IsString()
  @ApiProperty({ example: 'West Malaysia', description: 'Customer location' })
  location: string;

  @IsNumber()
  @ApiProperty({ example: 521.03, description: 'Premium paid' })
  premiumPaid: number;
}
