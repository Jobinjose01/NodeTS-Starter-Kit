import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { Language } from '../models/Language';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@injectable()
export class LanguageService extends BaseService<Language> {
    protected model: any;
    constructor() {
        super();
        this.model = prisma.language;
    }
}
