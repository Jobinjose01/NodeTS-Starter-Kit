import { body, param, ValidationChain } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import i18n from 'i18n';

const prisma = new PrismaClient();

export const userValidationRules = (): ValidationChain[] => {
    return [
        body('firstName')
            .isString()
            .withMessage(i18n.__('validator.FIRST_NAME_MUST_BE_A_STRING'))
            .isLength({ max: 190 })
            .withMessage(
                i18n.__(
                    'validator.FIRST_NAME_MUST_BE_LESS_THAN_191_CHARACTERS',
                ),
            ),
        body('lastName')
            .isString()
            .withMessage(i18n.__('validator.LAST_NAME_MUST_BE_A_STRING'))
            .isLength({ max: 190 })
            .withMessage(
                i18n.__('validator.LAST_NAME_MUST_BE_LESS_THAN_191_CHARACTERS'),
            ),
        body('username')
            .isString()
            .withMessage(i18n.__('validator.USERNAME_MUST_BE_VALID'))
            .custom(async (username) => {
                const user = await prisma.user.findUnique({
                    where: { username },
                });
                if (user) {
                    throw new Error(i18n.__('user.USERNAME_ALREADY_TAKEN'));
                }
                return true;
            }),
        body('phone')
            .isString()
            .withMessage(i18n.__('validator.PHONE_NUMBER_MUST_BE_A_STRING'))
            .notEmpty()
            .withMessage(i18n.__('validator.PHONE_NUMBER_IS_REQUIRED')),
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

export const userUpdateValidationRules = () => {
    return [
        param('id')
            .isInt()
            .withMessage(i18n.__('validator.USER_ID_MUST_BE_A_VALID_NUMBER')),
        body('firstName')
            .isString()
            .withMessage(i18n.__('validator.USERNAME_MUST_BE_A_STRING')),
        body('lastName')
            .isString()
            .withMessage(i18n.__('validator.LAST_NAME_MUST_BE_A_STRING')),
        body('username')
            .isString()
            .withMessage(i18n.__('validator.USERNAME_MUST_BE_A_VALID_EMAIL'))
            .custom(async (username, { req }) => {
                if (!req.params || !req.params.id) {
                    throw new Error(i18n.__('validator.USER_ID_IS_REQUIRED'));
                }
                const userId = parseInt(req.params.id);
                const user = await prisma.user.findUnique({
                    where: { username },
                });
                if (user && user.id !== userId) {
                    throw new Error(i18n.__('user.USERNAME_ALREADY_TAKEN'));
                }
            }),
        body('phone')
            .isString()
            .withMessage(i18n.__('validator.PHONE_NUMBER_MUST_BE_A_STRING')),
    ];
};
