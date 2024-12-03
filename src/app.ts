import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import i18n from './config/i18n';
import v1Routes from './routes/v1';
import { PrismaClient } from '@prisma/client';
import setupSwagger from './config/swagger/swaggerConfig';
import { errorHandler } from './middlewares/errorHandler';

import path from 'path';
import appConfig from './config/appConfig';

// Load environment variables from .env file
dotenv.config();

const app = express();

const prisma = new PrismaClient();

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));
if (process.env.NODE_ENV == 'development') {
    app.use(
        express.static(
            path.join(__dirname, '..', appConfig.PUBLIC_ASSET_PATH || 'public'),
        ),
    );
} else {
    app.use(express.static(path.join(appConfig.PUBLIC_ASSET_PATH || 'public')));
}

app.use(express.json({ limit: appConfig.UPLOAD_LIMIT }));
app.use(express.urlencoded({ limit: appConfig.UPLOAD_LIMIT, extended: true }));

//locale init
app.use(i18n.init);
//set locale from lang param
app.use((req, res, next) => {
    const lang = req.query.lang as string;
    if (lang) {
        res.setLocale(lang);
    } else {
        res.setLocale('en');
    }
    next();
});
//

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(v1Routes);
// Swagger setup
setupSwagger(app);

app.use(errorHandler);
// Prisma clean shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
