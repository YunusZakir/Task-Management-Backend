import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Invite) private readonly invitesRepo: Repository<Invite>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('accept-invite')
  @HttpCode(200)
  async acceptInvite(
    @Body()
    body: {
      token: string;
      name?: string;
      password: string;
    },
  ) {
    try {
      const invite = await this.invitesRepo.findOne({
        where: { token: body.token },
      });
      if (!invite) {
        throw new UnauthorizedException('Invalid invite token');
      }
      if (invite.acceptedAt) {
        throw new UnauthorizedException('Invite has already been used');
      }

      let user = await this.usersRepo.findOne({ 
        where: { email: invite.email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          isAdmin: true,
          name: true
        }
      });

      if (!user) {
        // Create new user if they don't exist
        user = new User();
        user.email = invite.email;
        user.passwordHash = await User.hashPassword(body.password);
        user.name = body.name;
        user.isAdmin = false;
        user = await this.usersRepo.save(user);
      }

      invite.acceptedAt = new Date();
      await this.invitesRepo.save(invite);

      // Use auth service to handle login
      return this.authService.login(user.email, body.password);
    } catch (error) {
      console.error('Accept invite error:', error);
      throw error;
    }
  }
}
