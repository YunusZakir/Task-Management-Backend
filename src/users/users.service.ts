import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  findAll() {
    return this.usersRepo.find({ order: { email: 'ASC' } });
  }

  async createAdminIfMissing(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) return existing;
    const user = new User();
    user.email = email;
    user.passwordHash = await User.hashPassword(password);
    user.isAdmin = true;
    return this.usersRepo.save(user);
  }
}
