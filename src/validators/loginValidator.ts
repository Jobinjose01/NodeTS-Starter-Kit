import { body } from 'express-validator';
import i18n from 'i18n';

export const loginValidationRules = () => {
    return [
        body('username')
            .isString()
            .withMessage(i18n.__('validator.USERNAME_MUST_BE_A_STRING')),
        body('password')
            .isString()
            .withMessage(i18n.__('validator.PASSWORD_MUST_BE_A_STRING'))
            .isLength({ min: 6 })
            .withMessage(
                i18n.__(
                    'validator.PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS_LONG',
                ),
            ),
    ];
};
