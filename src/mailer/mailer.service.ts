/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter?: Transporter;

  private async getTransporter(): Promise<Transporter> {
    if (this.transporter) return this.transporter;

    // Prefer SendGrid via SMTP when API key is provided (support common casing variants)
    const sendgridKey = process.env.SENDGRID_API_KEY || (process.env as any)['sendgrid_api_key'];
    if (sendgridKey) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: { user: 'apikey', pass: sendgridKey as string },
      });
      this.logger.log('Mailer using SendGrid SMTP');
      return this.transporter;
    }

    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
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

    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    this.logger.log(`Mailer using Ethereal test account: ${testAccount.user}`);
    return this.transporter;
  }

  async sendInviteEmail(toEmail: string, inviteLink: string): Promise<void> {
    try {
      // Prefer SendGrid REST API if key is provided
      const sendgridKey = process.env.SENDGRID_API_KEY || (process.env as any)['sendgrid_api_key'];
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
        } as unknown as RequestInit);
        if (!res.ok) {
          const text = await res.text();
          this.logger.error(`SendGrid send failed (${res.status}): ${text}`);
          return; // Do not fall back; configuration needs fixing
        } else {
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
        } as unknown as RequestInit);
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
      const info: SentMessageInfo = await transporter.sendMail({
        from,
        to: toEmail,
        subject,
        html,
        text,
      });
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) this.logger.log(`Preview invite email: ${preview}`);
    } catch (err) {
      const message = err instanceof Error ? err.stack || err.message : String(err);
      this.logger.error(`Failed to send invite email: ${message}`);
    }
  }
}
