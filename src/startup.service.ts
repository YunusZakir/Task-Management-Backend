import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { config } from './config';

@Injectable()
export class StartupService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.usersService.createAdminIfMissing(
        config.admin.email,
        config.admin.password
      );
      console.log('Admin user check completed successfully');
    } catch (error) {
      console.error('Error during startup:', error);
      throw error;
    }
  }
}


