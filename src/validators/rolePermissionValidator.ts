import { body, ValidationChain } from 'express-validator';
import i18n from 'i18n';

export const rolePermissionValidationRules = (): ValidationChain[] => {
    return [
        body('roleId')
            .isInt()
            .withMessage(i18n.__('permission.ROLEID_MUSTBE_NUMBER'))
            .toInt(),
        body('permissions')
            .isArray({ min: 1 })
            .withMessage(i18n.__('permission.PERMISSION_INVALID_INPUTDATA')),
        body('permissions.*.permissionId')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.PERMISSION_ID_MUSTBE_NUMBER')),
        body('permissions.*.add')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.ADD_MUSTBE_NUMBER')),
        body('permissions.*.edit')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.EDIT_MUSTBE_NUMBER')),
        body('permissions.*.remove')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.REMOVE_MUSTBE_NUMBER')),
        body('permissions.*.view')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.VIEW_MUSTBE_NUMBER')),
        body('permissions.*.reordering')
            .isInt()
            .toInt()
            .withMessage(i18n.__('permission.REORDER_MUSTBE_NUMBER')),
    ];
};
