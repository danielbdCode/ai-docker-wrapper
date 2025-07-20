export function sanitizeInput(input) {
    const forbidden = ['```', 'rm -rf', 'shutdown', 'format', 'docker', 'openai'];
    for (const word of forbidden) {
      if (input.toLowerCase().includes(word)) {
        throw new Error(`Forbidden content detected: "${word}"`);
      }
    }
    return input;
  }
  