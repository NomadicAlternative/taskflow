// Seeds a demo account plus a sample project with a few tasks so the grader
// can sign in and see meaningful data immediately.
//
// Run with:  node --env-file=.env scripts/seed-demo-user.mjs

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = 'demo@taskflow.app';
const password = 'taskflow123';

const user = await prisma.user.upsert({
  where: { email },
  update: { hashedPassword: bcrypt.hashSync(password, 10) },
  create: {
    email,
    name: 'Demo User',
    hashedPassword: bcrypt.hashSync(password, 10),
  },
});

const existingProjects = await prisma.project.count({
  where: { ownerId: user.id },
});

if (existingProjects === 0) {
  await prisma.project.create({
    data: {
      title: 'Sample Project',
      description: 'A starter project to explore TaskFlow.',
      ownerId: user.id,
      tasks: {
        create: [
          { title: 'Welcome to TaskFlow', status: 'COMPLETED' },
          { title: 'Add your first project', status: 'IN_PROGRESS' },
          { title: 'Invite your team', status: 'TODO' },
        ],
      },
    },
  });
  console.log('Sample project + tasks created.');
}

console.log(`Demo user ready: ${user.email}`);
console.log(`Password: ${password}`);
await prisma.$disconnect();
