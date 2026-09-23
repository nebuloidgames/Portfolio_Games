const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const gamesDir = path.join(process.cwd(), "public", "games");

const folders = fs
  .readdirSync(gamesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

console.log(`\nFound ${folders.length} game folders.\n`);

for (const folder of folders) {
  const gamePath = path.join(gamesDir, folder);
  const packageJson = path.join(gamePath, "package.json");
  const distPath = path.join(gamePath, "dist");

  if (!fs.existsSync(packageJson)) {
    console.log(`⏭️ Skipping ${folder} - no package.json`);
    continue;
  }

  console.log(`\n🎮 Building: ${folder}`);

  try {
    // Install dependencies
    execSync("npm install", {
      cwd: gamePath,
      stdio: "inherit",
    });

    // Build with relative asset paths
    execSync("npm run build -- --base=./", {
      cwd: gamePath,
      stdio: "inherit",
    });

    // Copy the production build into the public game folder
    if (fs.existsSync(distPath)) {
      fs.cpSync(distPath, gamePath, {
        recursive: true,
        force: true,
      });

      // Remove dist after copying
      fs.rmSync(distPath, {
        recursive: true,
        force: true,
      });
    }

    console.log(`✅ Built and deployed: ${folder}`);
  } catch (error) {
    console.error(`❌ Failed: ${folder}`);
    console.error(error.message);
  }
}

console.log("\n🎮 All game builds completed.\n");