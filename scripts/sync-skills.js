const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/babylonjs-skill/skills');
const destDir = path.join(__dirname, '../.agents/skills');

/**
 * Recursively copies a directory.
 */
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function sync() {
  console.log(`Syncing skills...`);
  console.log(`Source:      ${srcDir}`);
  console.log(`Destination: ${destDir}`);

  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory does not exist: ${srcDir}`);
    process.exit(1);
  }

  try {
    // Clean up destination directory first to avoid stale files
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
    copyDirSync(srcDir, destDir);
    console.log(`Success! Skills synchronized successfully to .agents/skills/`);
  } catch (error) {
    console.error(`Failed to synchronize skills:`, error);
    process.exit(1);
  }
}

sync();
