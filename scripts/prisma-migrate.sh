#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && . .env
set +a

# Run Prisma migrate with the DATABASE_URL from .env
npx prisma migrate dev --url="$DATABASE_URL" "$@"
