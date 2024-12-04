import { PrismaClient } from '@prisma/client';
import { body, param, ValidationChain } from 'express-validator';
import i18n from 'i18n';

const prisma = new PrismaClient();

export const roleValidationRules = (): ValidationChain[] => {
    return [
        body('name')
            .notEmpty()
            .withMessage(i18n.__('validator.ROLE_NAME_IS_REQUIRED'))
            .isString()
            .withMessage(i18n.__('validator.ROLE_NAME_MUST_BE_A_STRING'))
            .isLength({ max: 190 })
            .withMessage(
                i18n.__('validator.ROLE_NAME_MUST_BE_LESS_THAN_191_CHARACTERS'),
            )
            .custom(async (name) => {
                const role = await prisma.role.findUnique({
                    where: {
                        name,
                    },
                });

                if (role) {
                    throw new Error(
                        i18n.__('validator.ROLE_NAME_MUST_BE_UNIQUE'),
                    );
                }
                return true;
            }),
    ];
};

export const roleUpdateValidationRules = () => {
    return [
        body('name')
            .optional()
            .isString()
            .withMessage(i18n.__('validator.ROLE_NAME_MUST_BE_A_STRING'))
            .isLength({ max: 190 })
            .withMessage(
                i18n.__('validator.ROLE_NAME_MUST_BE_LESS_THAN_191_CHARACTERS'),
            )
            .custom(async (name, { req }) => {
                const { id }: any = req.params;
                const role = await prisma.role.findUnique({
                    where: { name },
                });

                if (role && role.id !== Number(id)) {
                    throw new Error(
                        i18n.__('validator.ROLE_NAME_MUST_BE_UNIQUE'),
                    );
                }
                return true;
            }),
        body('status')
            .optional()
            .toInt()
            .isInt()
            .withMessage(i18n.__('validator.STATUS_MUST_BE_A_VALID_INTEGER')),
    ];
};
