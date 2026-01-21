import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/prismaClient';
import emailService from '../utils/emailService';
import { User } from '../models/User';

@injectable()
export class PasswordService {
    private prisma = prisma;

    /**
     * Generate a password reset token
     */
    private generateResetToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Request password reset - send email with reset link
     */
    async requestPasswordReset(email: string): Promise<boolean> {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { username: email },
        });

        // Don't reveal if user exists or not for security
        if (!user) {
            return true; // Return true anyway to prevent user enumeration
        }

        // Generate reset token
        const resetToken = this.generateResetToken();
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Save token and expiry to database
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
                updatedAt: new Date(),
            },
        });

        // Send email
        await emailService.sendPasswordResetEmail(email, resetToken);

        return true;
    }

    /**
     * Verify reset token
     */
    async verifyResetToken(token: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gte: new Date(), // Token hasn't expired
                },
            },
        });

        return user;
    }

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        // Verify token
        const user = await this.verifyResetToken(token);
        if (!user) {
            return false;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                updatedAt: new Date(),
            },
        });

        // Send confirmation email
        await emailService.sendPasswordChangeConfirmation(user.username);

        return true;
    }

    /**
     * Change password for authenticated user
     */
    async changePassword(
        userId: number,
        currentPassword: string,
        newPassword: string,
    ): Promise<{ success: boolean; message: string }> {
        // Get user
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password,
        );
        if (!isPasswordValid) {
            return { success: false, message: 'Current password is incorrect' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });

        // Send confirmation email
        await emailService.sendPasswordChangeConfirmation(user.username);

        return { success: true, message: 'Password changed successfully' };
    }
}
