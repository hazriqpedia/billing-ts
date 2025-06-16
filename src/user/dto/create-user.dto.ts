import { IsEmail, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'george.bluth@yahoo.com.my' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'George' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Bluth' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'https://reqres.in/img/faces/1-image.jpg' })
  @IsUrl()
  photo: string;
}
