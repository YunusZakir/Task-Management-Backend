import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  // Mock AppService
  const mockAppService = {
    getHello: jest.fn().mockResolvedValue('Hello World!'), // async
  };

  // Mock UsersService
  const mockUsersService = {
    createAdminIfMissing: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should return "Hello World!"', async () => {
    // Call the async method
    const result = await appController.getHello();
    expect(result).toBe('Hello World!');

    // Ensure admin creation was called
    expect(mockUsersService.createAdminIfMissing).toHaveBeenCalled();
  });
});
