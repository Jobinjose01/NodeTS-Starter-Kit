import { Router } from 'express';
import container from '../config/inversifyConfig';
import { PasswordController } from '../controllers/passwordController';
import { validate } from '../middlewares/validate';
import {
    requestPasswordResetRules,
    resetPasswordRules,
    changePasswordRules,
} from '../validators/passwordValidator';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const passwordController = container.get(PasswordController);

/**
 * @route   POST /api/v1/password/forgot
 * @desc    Request password reset - sends email with reset link
 * @access  Public
 */
router.post(
    '/forgot',
    requestPasswordResetRules(),
    validate,
    passwordController.requestPasswordReset.bind(passwordController),
);

/**
 * @route   GET /api/v1/password/verify/:token
 * @desc    Verify reset token validity
 * @access  Public
 */
router.get(
    '/verify/:token',
    passwordController.verifyResetToken.bind(passwordController),
);

/**
 * @route   POST /api/v1/password/reset
 * @desc    Reset password using token
 * @access  Public
 */
router.post(
    '/reset',
    resetPasswordRules(),
    validate,
    passwordController.resetPassword.bind(passwordController),
);

/**
 * @route   PUT /api/v1/password/change
 * @desc    Change password for authenticated user
 * @access  Private (requires authentication)
 */
router.put(
    '/change',
    authMiddleware,
    changePasswordRules(),
    validate,
    passwordController.changePassword.bind(passwordController),
);

export default router;
