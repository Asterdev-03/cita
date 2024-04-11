const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        resume: `Aspiring Computer Science student.\nWORK HISTORY:\n1. Web Developer for Blueway Trading Company\n2. Front-end Developer (Volunteer) for GTech MuLearn\nSKILLS: C, C++, Java, Python , Database: MySQL, MongoDB , Time Management, Project Planning, HTML5, CSS, JavaScript , Problem Solving , Team Management, MERN Stack, Next.js, Detail-Oriented, Self-Management\nPERSONAL PROJECTS: Conversational Interview and Training Assistant (Ongoing),Quiz Web App,Portfolio Website,Discord Bot`,
      },
    });
  } catch (error) {
    console.error("Error seeding default user", error);
  } finally {
    await db.$disconnect();
  }
}

main();
