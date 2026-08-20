import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const user =
      this.configService.get<string>('SMTP_USER') ||
      process.env.SMTP_USER ||
      'banuvigrahala@gmail.com';
    let pass =
      this.configService.get<string>('SMTP_PASS') ||
      process.env.SMTP_PASS ||
      'vlzlhrkuqeqgwjlq';

    if (pass) {
      pass = pass.replace(/\s+/g, '');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
    this.logger.log(`Gmail transporter initialized successfully for ${user}`);
  }

  async sendTaskCreatedNotification(toEmail: string, userName: string, taskTitle: string, dueDate?: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const subject = `[Taskify] Task Created: "${taskTitle}"`;
    const formattedDate = dueDate
      ? new Date(dueDate).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Created</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%); padding:40px 30px; text-align:center; color:#ffffff;">
              <div style="display:inline-block; width:50px; height:50px; line-height:50px; background:rgba(255,255,255,0.2); border-radius:16px; font-size:24px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.3);">
                📋
              </div>
              <h1 style="margin:0; font-size:24px; font-weight:800; letter-spacing:-0.5px;">New Task Created</h1>
              <p style="margin:6px 0 0 0; font-size:14px; opacity:0.9;">Taskify Task Management System</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 16px 0; font-size:16px; color:#1e293b; font-weight:700;">Hello ${userName}, 👋</p>
              <p style="margin:0 0 25px 0; font-size:14px; color:#475569; line-height:1.6;">Your new task has been successfully created in your workspace. Here are the details:</p>

              <!-- Task Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; border-radius:16px; padding:20px; border:1px solid #cbd5e1; margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:6px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">Task Title</td>
                </tr>
                <tr>
                  <td style="font-size:18px; font-weight:800; color:#0f172a; padding-bottom:12px;">${taskTitle}</td>
                </tr>
                ${
                  formattedDate
                    ? `
                <tr>
                  <td style="padding-top:12px; border-top:1px solid #e2e8f0; font-size:13px; color:#334155;">
                    <strong style="color:#475569;">📅 Due Date:</strong> <span style="color:#4f46e5; font-weight:700;">${formattedDate}</span>
                  </td>
                </tr>`
                    : ''
                }
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${frontendUrl}/dashboard" style="display:inline-block; background-color:#4f46e5; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:14px 32px; border-radius:14px; box-shadow:0 4px 12px rgba(79, 70, 229, 0.3);">Open Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:25px 30px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#475569;">Taskify Task Management System</p>
              <p style="margin:0; font-size:11px; color:#94a3b8;">Automated task notification system.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendMail(toEmail, subject, html);
  }

  async sendTaskCompletedNotification(toEmail: string, userName: string, taskTitle: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const subject = `[Taskify] Task Completed: "${taskTitle}" 🎉`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Completed</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Header Banner (Emerald Celebration Gradient) -->
          <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding:40px 30px; text-align:center; color:#ffffff;">
              <div style="display:inline-block; width:50px; height:50px; line-height:50px; background:rgba(255,255,255,0.2); border-radius:16px; font-size:26px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.3);">
                🎉
              </div>
              <h1 style="margin:0; font-size:24px; font-weight:800; letter-spacing:-0.5px;">Task Accomplished!</h1>
              <p style="margin:6px 0 0 0; font-size:14px; opacity:0.9;">Great job staying productive!</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 16px 0; font-size:16px; color:#1e293b; font-weight:700;">Congratulations ${userName}! 🏆</p>
              <p style="margin:0 0 25px 0; font-size:14px; color:#475569; line-height:1.6;">You have marked the following task as <strong>DONE</strong>. Your completion statistics have been updated!</p>

              <!-- Completed Task Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ecfdf5; border-radius:16px; padding:20px; border:1px solid #a7f3d0; margin-bottom:28px;">
                <tr>
                  <td style="padding-bottom:6px; font-size:11px; font-weight:800; color:#047857; text-transform:uppercase; letter-spacing:0.5px;">Completed Task</td>
                </tr>
                <tr>
                  <td style="font-size:18px; font-weight:800; color:#065f46; padding-bottom:10px;">${taskTitle}</td>
                </tr>
                <tr>
                  <td>
                    <span style="display:inline-block; background-color:#10b981; color:#ffffff; padding:4px 12px; border-radius:12px; font-size:11px; font-weight:800;">STATUS: DONE</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${frontendUrl}/dashboard" style="display:inline-block; background-color:#059669; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:14px 32px; border-radius:14px; box-shadow:0 4px 12px rgba(5, 150, 105, 0.3);">View Productivity Dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:25px 30px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#475569;">Taskify Task Management System</p>
              <p style="margin:0; font-size:11px; color:#94a3b8;">Keep building momentum!</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendMail(toEmail, subject, html);
  }

  async sendPasswordResetEmail(toEmail: string, userName: string, resetUrl: string) {
    const subject = `[Taskify] Reset Your Password`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Header Banner (Security Purple Gradient) -->
          <tr>
            <td style="background:linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%); padding:40px 30px; text-align:center; color:#ffffff;">
              <div style="display:inline-block; width:50px; height:50px; line-height:50px; background:rgba(255,255,255,0.2); border-radius:16px; font-size:26px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.3);">
                🔐
              </div>
              <h1 style="margin:0; font-size:24px; font-weight:800; letter-spacing:-0.5px;">Password Reset Request</h1>
              <p style="margin:6px 0 0 0; font-size:14px; opacity:0.9;">Taskify Security Authentication</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 16px 0; font-size:16px; color:#1e293b; font-weight:700;">Hello ${userName},</p>
              <p style="margin:0 0 25px 0; font-size:14px; color:#475569; line-height:1.6;">We received a request to reset your password for your Taskify account. Click the button below to secure your account and set a new password:</p>

              <!-- Expiration Warning Alert -->
              <div style="background-color:#fffbeb; border-left:4px solid #f59e0b; padding:15px; border-radius:12px; margin-bottom:28px;">
                <p style="margin:0; font-size:12px; color:#b45309; font-weight:600;">
                  ⚠️ Security Notice: This password reset link is valid for <strong>1 hour only</strong>.
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display:inline-block; background-color:#4f46e5; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; padding:14px 36px; border-radius:14px; box-shadow:0 4px 12px rgba(79, 70, 229, 0.3);">Reset Password Now</a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link -->
              <p style="margin:0 0 8px 0; font-size:12px; color:#64748b;">If the button above does not work, copy and paste this URL into your browser:</p>
              <p style="margin:0; font-size:11px; word-break:break-all; background-color:#f1f5f9; border-radius:8px; padding:10px; font-family:monospace; color:#334155;">${resetUrl}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9; padding:25px 30px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px 0; font-size:12px; font-weight:700; color:#475569;">Taskify Security Team</p>
              <p style="margin:0; font-size:11px; color:#94a3b8;">If you did not request a password reset, please disregard this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await this.sendMail(toEmail, subject, html);
  }

  private async sendMail(to: string, subject: string, html: string) {
    const user =
      this.configService.get<string>('SMTP_USER') ||
      process.env.SMTP_USER ||
      'banuvigrahala@gmail.com';
    let pass =
      this.configService.get<string>('SMTP_PASS') ||
      process.env.SMTP_PASS ||
      'vlzlhrkuqeqgwjlq';

    if (pass) pass = pass.replace(/\s+/g, '');

    const from = this.configService.get<string>('EMAIL_FROM') || `"Taskify" <${user}>`;

    // 1. Primary Transporter: Nodemailer service 'gmail'
    try {
      if (this.transporter) {
        await this.transporter.sendMail({ from, to, subject, html });
        this.logger.log(`Email successfully dispatched to ${to}`);
        return;
      }
    } catch (primaryErr: any) {
      this.logger.warn(`Primary Gmail service dispatch failed: ${primaryErr.message}. Retrying via fallback port 465 SSL...`);
    }

    // 2. Fallback Transporter: Direct SMTP Port 465 SSL
    try {
      const fallbackTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      await fallbackTransporter.sendMail({ from, to, subject, html });
      this.logger.log(`Email successfully dispatched via fallback SSL to ${to}`);
    } catch (fallbackErr: any) {
      this.logger.error(`Failed to send email to ${to}: ${fallbackErr.message}`);
    }
  }
}
