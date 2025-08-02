// Fish for API keys: This script scans source files for hardcoded strings that might be API keys,
// tokens, or credentials accidentally committed to the codebase.
//
// It uses a set of modest heuristics to cut down on noise:
// - Skips binary and compressed files (see BINARY_EXTENSIONS)
// - Skips short strings (less than MAGIC_LENGTH)
// - Skips strings with spaces or repeated characters
// - Skips date-like and SSN-like values (see looksLikeDate(), looksLikeSSN())
//
// It also avoids scanning obvious non-threats:
// - Paths with lots of slashes (likely just filesystem references)
// - Known safe substrings (see IGNORED_SUBSTRINGS)
// - Mock/test files and other boilerplate (see IGNORED_DIRS, IGNORED_PATH_PATTERNS)
//
// Question: Why IGNORED_SUBSTRINGS?! Why not use regexes? Answer: Regexes are reified assumption, and how miss catching the unexpected.


const fs = require("fs");
const path = require("path");

const MAGIC_LENGTH = 10;

const IGNORED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".output",
  ".nx",
];
const IGNORED_FILES = ["package.json", "package-lock.json"];

const BINARY_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".ico",
  ".zip",
  ".gz",
  ".tar",
  ".rar",
  ".7z",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".pdf",
  ".exe",
  ".dll",
  ".bin",
  ".svg",
];

const IGNORED_PATH_PATTERNS = [
  /[/\\]src[/\\].*\.spec\.ts$/i,
  /[/\\]mock[/\\]/i,
];
const IGNORED_SUBSTRINGS = [
  "[a-zA-Z0-9]",
  "doc-item-",
  "p_signed___int64",
  "doc-name",
  "src/**/*.{ts,js,tsx,jsx}",
  "npm:",
  "RPRM",
  "AWS4-X509-RSA-SHA256",
  "USAMCLOVIN",
  "pathMatch",
  "DeviceType",
  "RPRM",
  "success",
  "BARCODE",
  ".snap",
  "tel:",
  "trimmedDate",
  "0000000000",
  "${year}-${month}-${day}",
  "#####-",
  "###-##-####",
  "A(1-2)",
  "_p___int64",
  "_p_uint",
  "_p_int",
  "X-Amz-X509",
  "dfID1_",
  "dfID2_",
  "dfID3_",
  "OS=='win'",
  "notice-$",
  "qwen3:30b-a3b",
  "**/*.spec.ts",
  "emit('ok')",
  "(?<rest>.*",
  "!x86-*/*.dll",
  "646277358753",
  "^(_.*|Story)",
  "./at10k.log",
  "**/*.test.ts",
  "FIC_JPEG2000",
];
const STRING_LITERAL_REGEX = /(?<!\/\/.*?)(["'`])((?:\\\1|.)*?)\1/g;

function looksLikeSSN(candidateString) {
  const digitsOnly = candidateString.replace(/[^0-9]/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length < 11; // Lots of tests have goofy SSN, which is intentional.
}

function looksLikeDate(candidateString) {
  // ISO
  const r1 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
  // More human
  const r2 = /^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{4}\/\d{2}\/\d{2})$/;

  if (r1.test(candidateString) || r2.test(candidateString)) return true;
  // What about bog standard JS?
  const parsed = new Date(candidateString);
  return !isNaN(parsed.valueOf());
}

function isBinaryFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (BINARY_EXTENSIONS.includes(ext)) return true;

  try {
    const buffer = fs.readFileSync(filePath);
    const sample = buffer.slice(0, 1000).toString("utf8");
    const nonPrintable = sample.match(/[^\x09\x0A\x0D\x20-\x7E]/g);
    return nonPrintable && nonPrintable.length > 100;
  } catch {
    // can't read it? I guess it's binary
    return true;
  }
}

function isLikelyAPath(candidateString) {
  // Paths have lots of / in them. Ignore strings with too high of a  / to char ratio
  const slashCount = (candidateString.match(/[\\/]/g) || []).length;
  const isLikelyPath = slashCount / candidateString.length > 0.1;
  if (isLikelyPath) return false;
  const englishRatio =
    (candidateString.match(/[a-zA-Z\s]/g) || []).length /
    candidateString.length;
  return englishRatio < 0.6;
}

function isSuspicious(candidateString) {
  if (candidateString.length <= MAGIC_LENGTH) return false;
  if (candidateString.includes(" ")) return false;
  if (/^([^\s])\1+$/.test(candidateString)) return false; // e.g., everything the same, such as ">>>>>>>" or "aaaaaa"

  if (looksLikeDate(candidateString)) {
    return false;
  }
  if (looksLikeSSN(candidateString)) {
    return false;
  }

  const lower = candidateString.toLowerCase();
  if (IGNORED_SUBSTRINGS.some((sub) => lower.includes(sub.toLowerCase()))) {
    return false;
  }
  const isOk = isLikelyAPath(candidateString);
  return isOk;
}

function isPathIgnored(filePath) {
  const normalized = filePath.replace(/\\/g, "/"); // Normalize slashes
  return IGNORED_PATH_PATTERNS.some((regex) => regex.test(normalized));
}

function scanFile(filePath) {
  const fileName = path.basename(filePath);
  if (
    IGNORED_FILES.includes(fileName) ||
    isBinaryFile(filePath) ||
    isPathIgnored(filePath)
  ) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    totalBytesScanned += Buffer.byteLength(content, "utf8");
    totalFilesScanned++;
    const lines = content.split("\n");

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("/*")) return;

      let match;
      while ((match = STRING_LITERAL_REGEX.exec(line)) !== null) {
        const value = match[2];
        if (isSuspicious(value)) {
          console.log(`${filePath}\n|${value}|`);
        }
      }
    });
  } catch (err) {
    console.log(
      `FAILBOT! Could not read file: ${filePath} because |${err.message}|`
    );
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        walk(entryPath);
      }
    } else if (entry.isFile()) {
      scanFile(entryPath);
    }
  }
}

// Hardcoded scan root - change to match where your repo is.
const startDir = "C:\\Users\\myname\\myworkdir\\myrepo\\basedir";
let totalFilesScanned = 0;
let totalBytesScanned = 0;

walk(path.resolve(startDir));

console.log(`\nFiles scanned: ${totalFilesScanned}`);
console.log(`Total bytes read: ${totalBytesScanned} bytes`);
console.log(`Fishing scan finished!`);
