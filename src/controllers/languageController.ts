import { inject, injectable } from 'inversify';
import { BaseController } from './BaseController';
import { LanguageService } from '../services/languageService';

@injectable()
export class LanguageController extends BaseController<LanguageService> {
    protected service: LanguageService;
    constructor(@inject(LanguageService) languageService: LanguageService) {
        super();
        this.service = languageService;
    }
}
