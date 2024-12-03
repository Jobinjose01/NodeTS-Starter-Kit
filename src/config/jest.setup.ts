import i18n from 'i18n';
import { join } from 'path';

i18n.configure({
    locales: ['en', 'es'],
    directory: join(__dirname, 'locales'),
    defaultLocale: 'en',
    register: global,
});

// Set the default locale to English for tests
i18n.setLocale('en');
