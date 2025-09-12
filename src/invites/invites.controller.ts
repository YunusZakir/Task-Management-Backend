import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { AdminOnly } from '../auth/roles.decorator';
import { InvitesService } from './invites.service';
import { MailerService } from '../mailer/mailer.service';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService, private readonly mailer: MailerService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AdminOnly()
  @Post()
  @HttpCode(200)
  async create(@Body() body: { email: string }) {
    const inv = await this.invitesService.create(body.email);
    const linkBase = process.env.APP_URL || 'http://localhost:4200';
    const inviteLink = `${linkBase}/accept-invite?token=${inv.token}`;
    await this.mailer.sendInviteEmail(inv.email, inviteLink);
    return inv;
  }

  @Get(':token')
  get(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }
}
