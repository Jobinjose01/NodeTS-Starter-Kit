A Node Based TypeScript boiler plate codebase for large scale application and micro-services based projects.
This project setup has following features.

* Docker Setup using Docker compose
* Unit Testing using Jest Framework
* E2E Using Supertest
* Multilanguage support using i18n packages
* Input validation using express validator
* Service based architecture followed
* Logging used with Winston package
* API documentation using with Swagger
* Linting using with ESLint
* Code Formatting using with Prettier
* Prisma ORM used
* Dependency Injection using Inversify

### Install dependancies 

`npm install`

### ENV setup

`cp .env.example .env`

### Run the seeders

`npm run seed`

if you want to run a specific seeder only

`npm run seed -- --name=Permissions`

### Run the app

`npm run dev`

### Take the Build

`npm run build`

### Unit Tesing

`npm run test`


### Linting and Formatting

Check lint errors

`npm run lint:check`

Fix lint errors

`npm run lint:fix`

Check the format

`npm run format:check`

Fix format errors

`npm run format:fix`

### Docker Setup

`docker compose up -d --build`

make sure your DB connections allowed from container, The localhost in the ENV won't work if you trying from docker without allowing mysql configuration to access your DB remotely

### Prisma ORM

`npm run prisma:generate`

`npm run prisma:migrate`

### Swagger URL

`http://localhost:PORT/api-docs`

