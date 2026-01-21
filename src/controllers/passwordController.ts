import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { PasswordService } from '../services/passwordService';
import { JwtPayload } from 'jsonwebtoken';

@injectable()
export class PasswordController {
    private passwordService: PasswordService;

    constructor(@inject(PasswordService) passwordService: PasswordService) {
        this.passwordService = passwordService;
    }

    /**
     * Request password reset - sends email with reset link
     * Public endpoint (no authentication required)
     */
    async requestPasswordReset(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { email } = req.body;

            await this.passwordService.requestPasswordReset(email);

            // Always return success to prevent user enumeration
            res.status(200).json({
                message: res.__('password.RESET_EMAIL_SENT_IF_EXISTS'),
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Verify reset token
     * Public endpoint (no authentication required)
     */
    async verifyResetToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const token = Array.isArray(req.params.token)
                ? req.params.token[0]
                : req.params.token;

            const user = await this.passwordService.verifyResetToken(token);

            if (!user) {
                res.status(400).json({
                    status: 'fail',
                    message: res.__('password.INVALID_OR_EXPIRED_TOKEN'),
                });
                return;
            }

            res.status(200).json({
                message: res.__('password.TOKEN_VALID'),
                result: {
                    valid: true,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reset password with token
     * Public endpoint (no authentication required)
     */
    async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { token, newPassword } = req.body;

            const success = await this.passwordService.resetPassword(
                token,
                newPassword,
            );

            if (!success) {
                res.status(400).json({
                    status: 'fail',
                    message: res.__('password.INVALID_OR_EXPIRED_TOKEN'),
                });
                return;
            }

            res.status(200).json({
                message: res.__('password.PASSWORD_RESET_SUCCESSFULLY'),
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change password for authenticated user
     * Requires authentication
     */
    async changePassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const user = (req as any).user as JwtPayload;
            const userId = user.user.id;
            const { currentPassword, newPassword } = req.body;

            const result = await this.passwordService.changePassword(
                userId,
                currentPassword,
                newPassword,
            );

            if (!result.success) {
                res.status(400).json({
                    status: 'fail',
                    message: res.__(result.message),
                });
                return;
            }

            res.status(200).json({
                message: res.__('password.PASSWORD_CHANGED_SUCCESSFULLY'),
            });
        } catch (error) {
            next(error);
        }
    }
}
