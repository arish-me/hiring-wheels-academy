import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@academy.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@academy.com',
      isAdmin: true,
    },
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@academy.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@academy.com',
      isAdmin: false,
    },
  });
  console.log('Seeded users:', { admin: admin.email, user: user.email });

  // Create courses
  const courses = [
    {
      title: 'HTML',
      slug: 'learn-html',
      description: 'Learn the basics of HTML for web development.',
      imageUrl: 'https://placehold.co/100x100/html',
    },
    {
      title: 'Python',
      slug: 'learn-python',
      description: 'Master Python programming from scratch.',
      imageUrl: 'https://placehold.co/100x100/python',
    },
  ];

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        ...courseData,
        chapters: {
          create: [
            {
              title: 'Getting Started',
              order: 1,
              topics: {
                create: [
                  {
                    title: 'Introduction',
                    slug: 'introduction',
                    order: 1,
                    content: `Welcome to ${courseData.title}!`,
                    hasCodeEditor: false,
                  },
                  {
                    title: 'Setup',
                    slug: 'setup',
                    order: 2,
                    content: `How to set up your environment for ${courseData.title}.`,
                    hasCodeEditor: true,
                  },
                ],
              },
            },
            {
              title: 'Core Concepts',
              order: 2,
              topics: {
                create: [
                  {
                    title: 'Syntax',
                    slug: 'syntax',
                    order: 1,
                    content: `Learn the syntax of ${courseData.title}.`,
                    hasCodeEditor: true,
                  },
                  {
                    title: 'Best Practices',
                    slug: 'best-practices',
                    order: 2,
                    content: `Best practices for writing ${courseData.title} code.`,
                    hasCodeEditor: false,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`Seeded course: ${course.title}`);
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 