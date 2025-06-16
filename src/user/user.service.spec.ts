import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  email: 'george.bluth@yahoo.com.my',
  firstName: 'George',
  lastName: 'Bluth',
  photo: 'https://reqres.in/img/faces/1-image.jpg',
  billings: [],
};

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should return all users', async () => {
    repo.find.mockResolvedValue([mockUser]);
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should return one user by id', async () => {
    repo.findOneBy.mockResolvedValue(mockUser);
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create and return a new user', async () => {
    repo.create.mockReturnValue(mockUser);
    repo.save.mockResolvedValue(mockUser);

    const result = await service.create({
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      photo: mockUser.photo,
    });

    expect(result).toEqual(mockUser);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });
});
