import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Invite } from '../entities/invite.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>, // ✅ Invite repository

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ✅ User repository

    private readonly jwtService: JwtService, // ✅ Inject JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        isAdmin: true,
        name: true
      }
    });

    if (!user) throw new UnauthorizedException('Invalid user');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const { passwordHash, ...rest } = user;
    return rest;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      const token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      return { 
        accessToken: token, 
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  }

