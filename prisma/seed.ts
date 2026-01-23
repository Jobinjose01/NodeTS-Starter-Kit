import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { roles } from './seeders/roles';
import { permissions } from './seeders/permissions';
import { rolePermissions } from './seeders/rolePermissions';
import { adminUser } from './seeders/adminUser';
import bcrypt from 'bcrypt';
import minimist from 'minimist';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Prisma 7 with MariaDB adapter for MySQL connections
const databaseUrl = (process.env.DATABASE_URL || '').replace(
    'mysql://',
    'mariadb://',
);
const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
});


// Define the type for the seeders object
type SeederFunctions = {
  [key: string]: () => Promise<void>;
};


async function seedUsers() {

  try{
    for (const user of adminUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await prisma.user.upsert({
        where: { username: user.username },
        update: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        create: {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log('User seeding finished.');
  }catch(error){
    console.log(error);
  }
}
async function seedRoles() {
  try{
    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }
    console.log('Roles have been seeded.');
  }catch(error){
    console.log(error);
  }
}

async function seedPermissions() {

  try{
    for (const permission of permissions) {
      await prisma.permission.upsert({
        where: { name: permission.name}, // Use the unique field
        update: {},
        create: {
          name: permission.name,
        },
      });
      
    }
    console.log('Permissions have been seeded.');
  }catch(error){
    console.log(error);
  }
}

async function seedRolePermissions(){

  for (const rp of rolePermissions) {
    const { roleId, permissions } = rp;

    // First, delete existing permissions for the role
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Prepare the new role permissions
    const currentTime = new Date();

    const rolePermissionsData = permissions.map(permission => ({
      roleId,
      ...permission,
      createdAt: currentTime,
      updatedAt: currentTime,
    }));

    // Create the new role permissions
    await prisma.rolePermission.createMany({
      data: rolePermissionsData,
    });

    console.log(`Created permissions for role ID: ${roleId}`);
  }
}

const seeders: SeederFunctions = {
  Roles: seedRoles,
  Users: seedUsers,
  Permissions: seedPermissions,
  RolePermissions: seedRolePermissions,
  // Add more seed functions as needed
};


async function main() {
  const args = minimist(process.argv.slice(2));
  const seederName: string | undefined = args.name;

  if (seederName) {
    const seederFunction = seeders[seederName];
    if (seederFunction) {
      console.log(`Running ${seederName} seeder...`);
      await seederFunction();
      console.log(`${seederName} seeder completed.`);
    } else {
      console.error(`No seeder found with the name "${seederName}".`);
    }
  } else {
    console.log('Running all seeders...');
    for (const seeder in seeders) {
      if (Object.prototype.hasOwnProperty.call(seeders, seeder)) {
        console.log(`Running ${seeder} seeder...`);
        await seeders[seeder]();
        console.log(`${seeder} seeder completed.`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
