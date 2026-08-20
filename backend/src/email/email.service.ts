import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn('SMTP credentials missing. Email notifications will be logged in fallback mode.');
    }
  }

  async sendTaskCreatedNotification(toEmail: string, userName: string, taskTitle: string, dueDate?: string) {
    const from = this.configService.get<string>('EMAIL_FROM') || '"Taskify" <noreply@taskify.app>';
    const subject = `[Taskify] Task Created: "${taskTitle}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6366f1;">Hello ${userName},</h2>
        <p>Your task <strong>"${taskTitle}"</strong> has been successfully created on Taskify!</p>
        ${dueDate ? `<p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>` : ''}
        <p>Keep up the great work!</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Taskify - Full Stack Task Management</p>
      </div>
    `;

    await this.sendMail(toEmail, subject, html);
  }

  async sendTaskCompletedNotification(toEmail: string, userName: string, taskTitle: string) {
    const subject = `[Taskify] Task Completed: "${taskTitle}" 🎉`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #10b981;">Great job, ${userName}! 🎉</h2>
        <p>You have marked the task <strong>"${taskTitle}"</strong> as <strong>DONE</strong>.</p>
        <p>Check your dashboard to view your updated progress statistics!</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Taskify - Full Stack Task Management</p>
      </div>
    `;

    await this.sendMail(toEmail, subject, html);
  }

  private async sendMail(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.log(`[MOCK EMAIL SENT] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      const from = this.configService.get<string>('EMAIL_FROM') || '"Taskify" <noreply@taskify.app>';
      await this.transporter.sendMail({ from, to, subject, html });
      this.logger.log(`Email successfully dispatched to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }
}
