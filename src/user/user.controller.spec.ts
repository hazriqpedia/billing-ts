import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

const mockUser: User = {
  id: 1,
  email: 'george.bluth@yahoo.com.my',
  firstName: 'George',
  lastName: 'Bluth',
  photo: 'https://reqres.in/img/faces/1-image.jpg',
  billings: [],
};

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<UserService>> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should return all users', async () => {
    service.findAll.mockResolvedValue([mockUser]);
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should return a user by ID', async () => {
    service.findOne.mockResolvedValue(mockUser);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    service.create.mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      photo: mockUser.photo,
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
