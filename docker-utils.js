import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

export function writeDockerfile(content, dir) {
  fs.writeFileSync(path.join(dir, 'Dockerfile'), content);
}

export function buildDockerImage(dir, tag = 'ai-script-image') {
  execSync(`docker build -t ${tag} .`, { cwd: dir, stdio: 'inherit' });
}

export function runDockerImage(tag, args) {
  // args is an array of arguments to pass to the container
  const dockerArgs = ['run', '--rm', tag, ...args];
  const result = spawnSync('docker', dockerArgs, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Docker run failed with exit code ${result.status}`);
}
