import "dotenv/config";
import * as readline from "node:readline";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

function createReadline() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function askHidden(_rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;

    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }

    let password = "";

    const onData = (chunk: Buffer) => {
      const char = chunk.toString();

      if (char === "\n" || char === "\r") {
        if (stdin.isTTY) {
          stdin.setRawMode(wasRaw ?? false);
        }
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(password);
        return;
      }

      if (char === "\u0003") {
        if (stdin.isTTY) {
          stdin.setRawMode(wasRaw ?? false);
        }
        stdin.removeListener("data", onData);
        process.exit(1);
      }

      if (char === "\u007F" || char === "\b") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }

      password += char;
      process.stdout.write("*");
    };

    stdin.on("data", onData);
  });
}

async function main() {
  console.log("=== Nebuloid Games — Admin Bootstrap ===\n");
  console.log(
    "This script creates the first ADMIN account for local development.\n",
  );

  const rl = createReadline();

  try {
    const fullName = await ask(rl, "Full name: ");
    if (!fullName) {
      console.error("Error: Full name is required.");
      process.exit(1);
    }

    const email = await ask(rl, "Email: ");
    if (!email || !email.includes("@")) {
      console.error("Error: A valid email is required.");
      process.exit(1);
    }

    const username = await ask(rl, "Username: ");
    if (!username) {
      console.error("Error: Username is required.");
      process.exit(1);
    }

    const password = await askHidden(rl, "Password: ");
    if (password.length < 8) {
      console.error("Error: Password must be at least 8 characters.");
      process.exit(1);
    }

    // Check for existing user by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
      select: { id: true, email: true, username: true },
    });

    if (existingUser) {
      console.error(
        `\nError: A user with that email or username already exists (id: ${existingUser.id}).`,
      );
      console.error("Cannot create duplicate admin account.");
      process.exit(1);
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        role: true,
        status: true,
      },
    });

    console.log("\nAdmin account created successfully!");
    console.log(`  ID:       ${user.id}`);
    console.log(`  Name:     ${user.fullName}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Role:     ${user.role}`);
    console.log(`  Status:   ${user.status}`);
    console.log(
      "\nYou can now log in at http://localhost:3000/login with the username and password you provided.",
    );
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Bootstrap failed:", e);
  process.exit(1);
});
