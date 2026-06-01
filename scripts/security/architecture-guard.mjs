import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../../src');

let violations = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // 1. Check for import.meta.glob
      if (content.includes('import.meta.glob')) {
        console.error(`\x1b[31m[ARCH GUARD] Violation in ${fullPath}: Usage of import.meta.glob detected.\x1b[0m`);
        violations++;
      }
      
      // 2. Check for gray-matter
      if (content.includes("from 'gray-matter'") || content.includes('from "gray-matter"')) {
        console.error(`\x1b[31m[ARCH GUARD] Violation in ${fullPath}: Import of gray-matter detected.\x1b[0m`);
        violations++;
      }
      
      // 3. Check for FALLBACK_ arrays
      if (/const\s+FALLBACK_/.test(content)) {
        console.error(`\x1b[31m[ARCH GUARD] Violation in ${fullPath}: FALLBACK_ fallback data detected.\x1b[0m`);
        violations++;
      }
    }
  }
}

console.log("\x1b[36m[ARCH GUARD] Scanning src/ directory for architecture drift...\x1b[0m");
scanDirectory(srcDir);

if (violations > 0) {
  console.error(`\x1b[31m\n[ARCH GUARD] FATAL: ${violations} architecture violations found. Build aborted.\x1b[0m`);
  process.exit(1);
} else {
  console.log("\x1b[32m[ARCH GUARD] Architecture clean. Proceeding with build.\x1b[0m");
}
