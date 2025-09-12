import { InvitesService } from './invites.service';
import { MailerService } from '../mailer/mailer.service';
export declare class InvitesController {
    private readonly invitesService;
    private readonly mailer;
    constructor(invitesService: InvitesService, mailer: MailerService);
    create(body: {
        email: string;
    }): Promise<import("../entities/invite.entity").Invite>;
    get(token: string): Promise<import("../entities/invite.entity").Invite | null>;
}
