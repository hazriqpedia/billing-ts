import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'george.bluth@yahoo.com.my' })
  email: string;

  @ApiProperty({ example: 'George' })
  firstName: string;

  @ApiProperty({ example: 'Bluth' })
  lastName: string;

  @ApiProperty({ example: 'https://reqres.in/img/faces/1-image.jpg' })
  photo: string;
}
