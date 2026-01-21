#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && . .env
set +a

# Run Prisma migrate deploy with the DATABASE_URL from .env
npx prisma migrate deploy --url="$DATABASE_URL" "$@"
