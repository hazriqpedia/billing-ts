import { ApiProperty } from '@nestjs/swagger';

export class ResponseBillingDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 4000 })
  productCode: number;

  @ApiProperty({ example: 'West Malaysia' })
  location: string;

  @ApiProperty({ example: 521.03 })
  premiumPaid: number;
}
