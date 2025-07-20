import { sanitizeInput } from '../sanitize.js';

describe('sanitizeInput', () => {
  it('should allow safe input', () => {
    expect(() => sanitizeInput('print("hi")')).not.toThrow();
  });

  it('should block malicious input', () => {
    expect(() => sanitizeInput('rm -rf /')).toThrow(/Forbidden/);
  });
});