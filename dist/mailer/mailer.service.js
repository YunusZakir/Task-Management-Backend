"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
let MailerService = MailerService_1 = class MailerService {
    constructor() {
        this.logger = new common_1.Logger(MailerService_1.name);
    }
    async getTransporter() {
        if (this.transporter)
            return this.transporter;
        const sendgridKey = process.env.SENDGRID_API_KEY || process.env['sendgrid_api_key'];
        if (sendgridKey) {
            this.transporter = nodemailer_1.default.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: { user: 'apikey', pass: sendgridKey },
            });
            this.logger.log('Mailer using SendGrid SMTP');
            return this.transporter;
        }
        if (process.env.SMTP_HOST) {
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: process.env.SMTP_USER
                    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                    : undefined,
            });
            this.logger.log('Mailer using custom SMTP');
            return this.transporter;
        }
        const testAccount = await nodemailer_1.default.createTestAccount();
        this.transporter = nodemailer_1.default.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        this.logger.log(`Mailer using Ethereal test account: ${testAccount.user}`);
        return this.transporter;
    }
    async sendInviteEmail(toEmail, inviteLink) {
        try {
            const sendgridKey = process.env.SENDGRID_API_KEY || process.env['sendgrid_api_key'];
            if (sendgridKey) {
                const from = process.env.MAIL_FROM || 'no-reply@taskboard.local';
                const subject = 'You are invited to the Task Board';
                const url = inviteLink;
                const html = `
          <div style="font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.6;color:#0b1324">
            <p>You have been invited to the Task Board.</p>
            <p>
              <a href="${url}" target="_blank" rel="noopener"
                 style="display:inline-block;background:#0052cc;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:600">
                Accept your invite
              </a>
            </p>
            <p style="font-size:12px;color:#6b7280">If the button does not work, copy this link:</p>
            <p style="word-break:break-all">${url}</p>
          </div>`;
                const text = `You have been invited to the Task Board.\n\nAccept your invite: ${url}`;
                const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sendgridKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalizations: [{ to: [{ email: toEmail }] }],
                        from: { email: from },
                        subject,
                        content: [
                            { type: 'text/plain', value: text },
                            { type: 'text/html', value: html },
                        ],
                    }),
                });
                if (!res.ok) {
                    const text = await res.text();
                    this.logger.error(`SendGrid send failed (${res.status}): ${text}`);
                    return;
                }
                else {
                    this.logger.log(`Invite email sent via SendGrid to ${toEmail}`);
                    return;
                }
            }
            const formspreeUrl = process.env.FORMSPREE_FORM_URL;
            if (formspreeUrl) {
                const subject = 'You are invited to the Task Board';
                const html = `<p>You have been invited to the Task Board.</p><p><a href="${inviteLink}">Click here to accept your invite</a></p>`;
                const res = await fetch(formspreeUrl, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: toEmail,
                        subject,
                        message: html,
                        _replyto: toEmail,
                    }),
                });
                if (res.ok) {
                    this.logger.log(`Invite email sent via Formspree to ${toEmail}`);
                    return;
                }
                const text = await res.text();
                this.logger.warn(`Formspree send failed (${res.status}): ${text}`);
            }
            const transporter = await this.getTransporter();
            const from = process.env.MAIL_FROM || 'no-reply@taskboard.local';
            const url = inviteLink;
            const subject = 'You are invited to the Task Board';
            const html = `
        <div style="font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.6;color:#0b1324">
          <p>You have been invited to the Task Board.</p>
          <p>
            <a href="${url}" target="_blank" rel="noopener"
               style="display:inline-block;background:#0052cc;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:600">
              Accept your invite
            </a>
          </p>
          <p style="font-size:12px;color:#6b7280">If the button does not work, copy this link:</p>
          <p style="word-break:break-all">${url}</p>
        </div>`;
            const text = `You have been invited to the Task Board.\n\nAccept your invite: ${url}`;
            const info = await transporter.sendMail({
                from,
                to: toEmail,
                subject,
                html,
                text,
            });
            const preview = nodemailer_1.default.getTestMessageUrl(info);
            if (preview)
                this.logger.log(`Preview invite email: ${preview}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.stack || err.message : String(err);
            this.logger.error(`Failed to send invite email: ${message}`);
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = MailerService_1 = __decorate([
    (0, common_1.Injectable)()
], MailerService);
//# sourceMappingURL=mailer.service.js.map