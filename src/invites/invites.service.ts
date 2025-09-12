import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { randomBytes } from 'crypto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>, // ✅ consistent name
    private readonly mailerService: MailerService,
  ) {}

  async create(email: string) {
    const token = randomBytes(24).toString('hex');
    const invite = this.inviteRepository.create({ email, token }); // ✅ fixed
    return this.inviteRepository.save(invite); // ✅ fixed
  }

  findByToken(token: string) {
    return this.inviteRepository.findOne({ where: { token } }); // ✅ fixed
  }
}
