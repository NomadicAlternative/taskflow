// Seeds the demo account with realistic sample data so the app (and any
// screenshot taken from it) looks like a product in use instead of an empty
// shell.
//
// Re-running this script resets the demo account's projects, which is what you
// want after editing the sample data below.
//
// Run with:  node --env-file=.env scripts/seed-demo-user.mjs

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = 'demo@taskflow.app';
const password = 'taskflow123';

const projects = [
  {
    title: 'Website Redesign',
    description: 'Refresh the marketing site before the public launch.',
    tasks: [
      { title: 'Audit current landing page', status: 'COMPLETED' },
      { title: 'Define type scale and color tokens', status: 'COMPLETED' },
      { title: 'Rebuild hero section', status: 'IN_PROGRESS' },
      { title: 'Responsive pass on mobile navigation', status: 'TODO' },
      { title: 'Lighthouse audit before launch', status: 'TODO' },
    ],
  },
  {
    title: 'Authentication Hardening',
    description: 'Close the gaps found in the security review.',
    tasks: [
      { title: 'Scope every query by owner', status: 'COMPLETED' },
      {
        title: 'Return 404 instead of 403 for foreign resources',
        status: 'COMPLETED',
      },
      { title: 'Add ownership regression script', status: 'IN_PROGRESS' },
      { title: 'Rate limit the credentials endpoint', status: 'TODO' },
    ],
  },
  {
    title: 'Team Onboarding',
    description: 'Make the first ten minutes of a new account make sense.',
    tasks: [
      { title: 'Write the README quick start', status: 'COMPLETED' },
      { title: 'Seed a demo account', status: 'COMPLETED' },
      { title: 'Add empty states with a next step', status: 'IN_PROGRESS' },
      { title: 'Record a two-minute walkthrough', status: 'TODO' },
      { title: 'Collect feedback from the first three users', status: 'TODO' },
      { title: 'Turn feedback into a backlog', status: 'TODO' },
    ],
  },
  {
    title: 'Q4 Release',
    description: 'Everything that has to ship before the term ends.',
    tasks: [
      { title: 'Merge the ownership fix', status: 'COMPLETED' },
      { title: 'Deploy production build', status: 'COMPLETED' },
      { title: 'Verify contrast on every screen', status: 'IN_PROGRESS' },
      { title: 'Write release notes', status: 'TODO' },
    ],
  },
];

const user = await prisma.user.upsert({
  where: { email },
  update: { hashedPassword: bcrypt.hashSync(password, 10) },
  create: {
    email,
    name: 'Demo User',
    hashedPassword: bcrypt.hashSync(password, 10),
  },
});

const removed = await prisma.project.deleteMany({
  where: { ownerId: user.id },
});

for (const project of projects) {
  await prisma.project.create({
    data: {
      title: project.title,
      description: project.description,
      ownerId: user.id,
      tasks: { create: project.tasks },
    },
  });
}

const taskCount = projects.reduce((total, p) => total + p.tasks.length, 0);

console.log(`Demo user ready: ${user.email}`);
console.log(`Password: ${password}`);
console.log(
  `Projects reset: ${removed.count} removed, ${projects.length} created`,
);
console.log(`Tasks created: ${taskCount}`);

await prisma.$disconnect();
