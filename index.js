import fs from 'fs';
import path from 'path';
import { getCompletion } from './llm-wrapper.js';
import { writeDockerfile, buildDockerImage, runDockerImage } from './docker-utils.js';
import { sanitizeInput } from './sanitize.js';
import shellQuote from 'shell-quote';

 // For Python
const scriptPath = './scripts/word_reverser.py';
const readmePath = './scripts/README_word_reverser.md';

// // For Shell
// const scriptPath = './scripts/line_counter.sh';
// const readmePath = './scripts/README_line_counter.md';

// // For JavaScript
// const scriptPath = './scripts/vowel_counter.js';
// const readmePath = './scripts/README_vowel_counter.md';

const dir = path.dirname(scriptPath);
const tag = 'wrapped-script';

function extractUsageExample(readmeContent) {
  const usageSection = readmeContent.match(/## Usage([\s\S]*?)(?=##|$)/);
  const exampleSection = readmeContent.match(/## Example([\s\S]*?)(?=##|$)/);

  if (exampleSection) {
    const codeBlockMatch = exampleSection[1].match(/```bash\s+([\s\S]+?)```/);
    if (codeBlockMatch) return codeBlockMatch[1].trim();
  }

  if (usageSection) {
    const commandMatch = usageSection[1].match(/```bash\s+([\s\S]+?)```/);
    if (commandMatch) return commandMatch[1].trim();
  }

  throw new Error('Usage example not found in README.');
}

async function generateDockerfile(scriptContent, usageExample) {
  const prompt = `
You are a DevOps expert AI.

Given the following script and usage example, write a valid Dockerfile that can run it.

Script:
--------------------
${scriptContent}

Usage Example:
--------------------
${usageExample}

IMPORTANT: The Dockerfile should use the correct base image and ENTRYPOINT/CMD for the script type:
- For Python scripts (.py): Use ENTRYPOINT ["python"] and CMD ["script_name.py"]
- For Shell scripts (.sh): Use ENTRYPOINT ["bash"] and CMD ["script_name.sh"] or ENTRYPOINT ["bash", "script_name.sh"]
- For Node.js scripts (.js): Use ENTRYPOINT ["node"] and CMD ["script_name.js"]

The key is that additional arguments should be passed to the script, not override the entire command. Use best practices for Dockerfiles.

Only return the Dockerfile content, no explanations.
`;

  const rawDockerfile = await getCompletion(prompt);

  // הסרת קווים מיותרים אם קיימים
  const cleaned = rawDockerfile
    .replace(/^```(?:dockerfile)?/i, '') // מסיר שורה ראשונה אם מתחילה ב-``` או ```dockerfile
    .replace(/```$/, '') // מסיר שורה אחרונה של ```
    .trim();

  return cleaned;
}

async function main() {
  console.log('[+] Reading script...');
  const scriptContent = fs.readFileSync(scriptPath, 'utf-8');

  console.log('[+] Reading README...');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const usageExample = extractUsageExample(readmeContent);

  console.log('[+] Sanitizing input...');
  sanitizeInput(scriptContent);
  sanitizeInput(usageExample);

  console.log('[+] Generating Dockerfile via LLM...');
  const dockerfile = await generateDockerfile(scriptContent, usageExample);

  console.log('[+] Writing Dockerfile...');
  writeDockerfile(dockerfile, dir);

  console.log('[+] Building Docker image...');
  buildDockerImage(dir, tag);

  console.log('[+] Running Docker image...');
  const commandArgs = shellQuote.parse(usageExample).slice(1); // remove script name
  runDockerImage(tag, commandArgs);
}

main().catch(err => console.error('ERROR:', err.message));
