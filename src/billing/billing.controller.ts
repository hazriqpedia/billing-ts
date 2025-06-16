import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { QueryBillingDto } from './dto/query-billing.dto';
import { ResponseBillingDto } from './dto/response-billing.dto';
import { RolesGuard } from '../middleware/roles.middleware';
import { UserService } from '../user/user.service';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all billing records (optionally filter by productCode & location)',
  })
  @ApiOkResponse({ type: [ResponseBillingDto] })
  getAll(@Query() query: QueryBillingDto) {
    const { productCode, location } = query;
    return this.billingService.findAll(productCode, location);
  }

  @Post()
  @UseGuards(RolesGuard)
  @ApiSecurity('role-header')
  @ApiOperation({ summary: 'Create a new billing record (Admin only)' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @ApiBody({ type: CreateBillingDto })
  @ApiResponse({ status: 201, type: ResponseBillingDto })
  async create(@Query('userId') userId: number, @Body() dto: CreateBillingDto) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.billingService.create(dto, user);
  }

  @Put()
  @UseGuards(RolesGuard)
  @ApiSecurity('role-header')
  @ApiOperation({
    summary: 'Update a billing record by productCode (Admin only)',
  })
  @ApiQuery({ name: 'productCode', required: true, type: Number })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @ApiBody({ type: UpdateBillingDto })
  @ApiResponse({ status: 200, type: ResponseBillingDto })
  async update(
    @Query('productCode') productCode: number,
    @Query('userId') userId: number,
    @Body() dto: UpdateBillingDto,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.billingService.update(productCode, dto, user);
  }

  @Delete()
  @UseGuards(RolesGuard)
  @ApiSecurity('role-header')
  @ApiOperation({
    summary: 'Delete a billing record by productCode (Admin only)',
  })
  @ApiQuery({ name: 'productCode', required: true, type: Number })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Billing record deleted' })
  async remove(
    @Query('productCode') productCode: number,
    @Query('userId') userId: number,
  ) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    return this.billingService.remove(productCode, user);
  }
}
