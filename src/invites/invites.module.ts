import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { Invite } from '../entities/invite.entity';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite]), // Repository injection
    MailerModule, // ✅ make MailerService available
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule{}