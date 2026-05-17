import fs from 'fs';
import path from 'path';

// Regexes to identify potential secrets
const PATTERNS = {
  GOOGLE_API_KEY: /AIzaSy[A-Za-z0-9_\-]{35}/g,
  PRIVATE_KEY: /-----BEGIN [A-Z ]*PRIVATE KEY-----|PRIVATE_KEY\s*=\s*['"][a-zA-Z0-9+/=]+['"]/gi,
  GENERIC_SECRET: /(SECRET|PASSWORD|PASSWORD_HASH|API_KEY|CLIENT_SECRET|PRIVATE_KEY)\s*=\s*['"a-zA-Z0-9_\-]{12,}/gi
};

// Directories and files to exclude from the scan
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git', 'build', 'coverage']);
const EXCLUDE_FILES = new Set(['package-lock.json', '.env', '.env.local', '.env.example', 'service-account.json', 'scripts/security-scan.ts', 'README.md', 'LICENSE']);

let violationCount = 0;

function scanFile(filePath: string, strict: boolean): void {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // 1. Scan for Google API Keys
      const googleMatches = line.match(PATTERNS.GOOGLE_API_KEY);
      if (googleMatches) {
        googleMatches.forEach(match => {
          violationCount++;
          console.warn(
            `\x1b[33m⚠️  [SECURITY WARNING] Potential hardcoded Google API Key found in:\x1b[0m\n` +
            `   File: ${filePath}:${index + 1}\n` +
            `   Key pattern: ${match.substring(0, 10)}... (truncated)\n` +
            `   \x1b[36m👉 Please load this key dynamically from process.env / import.meta.env instead!\x1b[0m\n`
          );
        });
      }

      // 2. Scan for Private Keys
      if (line.match(PATTERNS.PRIVATE_KEY)) {
        violationCount++;
        console.warn(
          `\x1b[31m❌ [SECURITY CRISIS] Potential hardcoded PRIVATE KEY block found in:\x1b[0m\n` +
          `   File: ${filePath}:${index + 1}\n` +
          `   \x1b[36m👉 Decouple private keys immediately!\x1b[0m\n`
        );
      }

      // 3. Scan for generic hardcoded secrets/passwords (excluding variables mapped to empty placeholders or standard keys)
      const secretMatches = line.match(PATTERNS.GENERIC_SECRET);
      if (secretMatches) {
        // Filter out safe mappings like SECRET="" or process.env mappings
        secretMatches.forEach(match => {
          const isPlaceholder = match.toLowerCase().includes('=""') || match.toLowerCase().includes("=''") || match.includes('process.env');
          if (!isPlaceholder) {
            violationCount++;
            console.warn(
              `\x1b[33m⚠️  [SECURITY WARNING] Potential generic secret/key hardcoded in:\x1b[0m\n` +
              `   File: ${filePath}:${index + 1}\n` +
              `   Pattern matched: "${match.substring(0, 30)}..."\n`
            );
          }
        });
      }
    });
  } catch (error: any) {
    console.error(`Failed to scan file: ${filePath}`, error.message);
  }
}

function walkDir(dirPath: string, strict: boolean): void {
  let files: string[];
  try {
    files = fs.readdirSync(dirPath);
  } catch (error: any) {
    console.error(`Failed to read directory: ${dirPath}`, error.message);
    return;
  }

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch (error: any) {
      console.error(`Failed to get stats for: ${fullPath}`, error.message);
      return;
    }

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.has(file)) {
        walkDir(fullPath, strict);
      }
    } else {
      if (!EXCLUDE_FILES.has(file) && !file.startsWith('.env')) {
        const ext = path.extname(file).toLowerCase();
        if (['.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.md', '.css'].includes(ext)) {
          scanFile(fullPath, strict);
        }
      }
    }
  });
}

function run(): void {
  const isStrict = process.argv.includes('--strict');
  console.log(`\x1b[36m🔍 Running security scan for hardcoded secrets [Strict Mode: ${isStrict}]...\x1b[0m`);
  
  const workspaceRoot = process.cwd();
  walkDir(workspaceRoot, isStrict);
  
  if (violationCount > 0) {
    console.log(`\x1b[33m⚠️  Scan complete. Found ${violationCount} potential security issue(s).\x1b[0m`);
    if (isStrict) {
      console.error('\x1b[41m\x1b[37m❌ COMMIT BLOCKED: Hardcoded secrets detected in strict pre-commit mode!\x1b[0m');
      process.exit(1);
    }
  } else {
    console.log('\x1b[32m✅ Security scan complete. No hardcoded secrets found!\x1b[0m');
  }
  process.exit(0);
}

run();
