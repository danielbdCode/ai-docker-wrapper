import fs from 'fs';
import path from 'path';
import { writeDockerfile } from '../docker-utils.js';

const tempDir = './tmp_test';

beforeAll(() => {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true });
});

test('writeDockerfile writes file', () => {
  const content = 'FROM alpine\nCMD echo hello';
  writeDockerfile(content, tempDir);
  const written = fs.readFileSync(path.join(tempDir, 'Dockerfile'), 'utf8');
  expect(written).toBe(content);
});
