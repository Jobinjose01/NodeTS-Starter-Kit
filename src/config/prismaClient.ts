import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Prisma 7 with MariaDB adapter for MySQL connections
// Convert mysql:// to mariadb:// for the adapter
const databaseUrl = (process.env.DATABASE_URL || '').replace(
    'mysql://',
    'mariadb://',
);
const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
});

export default prisma;
