export declare class MailerService {
    private readonly logger;
    private transporter?;
    private getTransporter;
    sendInviteEmail(toEmail: string, inviteLink: string): Promise<void>;
}
