import nodemailer from 'nodemailer';
import {
    passwordResetTemplate,
    passwordChangeTemplate,
} from '../config/templates/emails';
import { logEmail } from './emailLogger';

/**
 * Email service for sending emails via SMTP or logging to file
 * Supports EMAIL_DRIVER: 'smtp' (default) or 'log'
 */

const EMAIL_DRIVER = process.env.EMAIL_DRIVER?.toLowerCase() || 'smtp';

// Create reusable transporter (only if using SMTP)
const transporter =
    EMAIL_DRIVER === 'smtp'
        ? nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: parseInt(process.env.SMTP_PORT || '587'),
              secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
              auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
              },
          })
        : null;

// Verify transporter configuration (only if using SMTP)
if (EMAIL_DRIVER === 'smtp' && transporter) {
    transporter.verify((error) => {
        if (error) {
            console.error('SMTP configuration error:', error);
        } else {
            console.log('SMTP server is ready to send emails');
        }
    });
} else if (EMAIL_DRIVER === 'log') {
    console.log(
        '📧 Email driver set to LOG - Emails will be written to logs/emails/',
    );
}

/**
 * Send email via SMTP or log to file based on EMAIL_DRIVER
 */
export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
): Promise<boolean> => {
    try {
        if (EMAIL_DRIVER === 'log') {
            // Log email to file instead of sending
            logEmail(to, subject, html);
            console.log(
                `📧 Email logged to file - TO: ${to}, SUBJECT: ${subject}`,
            );
            return true;
        }

        // Send via SMTP
        if (!transporter) {
            console.error('SMTP transporter not initialized');
            return false;
        }

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'StarterKit'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        // Additionally log email if LOGGER_LEVEL is high
        if (process.env.LOGGER_LEVEL === 'high') {
            logEmail(to, subject, html);
        }

        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string,
): Promise<boolean> => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = passwordResetTemplate(resetUrl, resetToken);

    return await sendEmail(to, subject, html);
};

/**
 * Send password change confirmation email
 */
export const sendPasswordChangeConfirmation = async (
    to: string,
): Promise<boolean> => {
    const subject = 'Password Changed Successfully';
    const html = passwordChangeTemplate();

    return await sendEmail(to, subject, html);
};

export default {
    sendEmail,
    sendPasswordResetEmail,
    sendPasswordChangeConfirmation,
};
