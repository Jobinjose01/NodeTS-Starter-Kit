#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && . .env
set +a

# Run Prisma migrate deploy with explicit config file path
npx prisma migrate deploy --config prisma/prisma.config.ts "$@"
