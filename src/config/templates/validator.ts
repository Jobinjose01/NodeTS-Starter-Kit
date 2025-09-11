
import { PrismaClient } from '@prisma/client';
import { body, ValidationChain } from 'express-validator';
import i18n from 'i18n';
import prisma from '../config/prismaClient';


export const ${modelName}ValidationRules = (): ValidationChain[] => {
  return [
      ${createValidation}
  ];
};

export const ${modelName}UpdateValidationRules = (): ValidationChain[] => {
  return [
      ${updateValidation}
  ];
};