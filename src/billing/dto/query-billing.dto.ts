import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBillingDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // ensure query param is parsed as number
  @ApiPropertyOptional({ description: 'Filter by productCode' })
  productCode?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by location' })
  location?: string;
}
