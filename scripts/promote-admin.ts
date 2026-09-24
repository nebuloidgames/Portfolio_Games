import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];

  if (!username) {
    console.error("Usage: npm run admin:promote -- <username>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, role: true },
  });

  if (!user) {
    console.error(`User "${username}" not found.`);
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.log(`User "${username}" is already an ADMIN.`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { username },
    data: { role: "ADMIN" },
  });

  console.log(`User "${username}" has been promoted to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
