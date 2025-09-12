import { Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { MailerService } from '../mailer/mailer.service';
export declare class InvitesService {
    private readonly inviteRepository;
    private readonly mailerService;
    constructor(inviteRepository: Repository<Invite>, mailerService: MailerService);
    create(email: string): Promise<Invite>;
    findByToken(token: string): Promise<Invite | null>;
}
