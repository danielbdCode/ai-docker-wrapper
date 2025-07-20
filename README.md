# AI Docker Wrapper - Daniel Ben David

Automate the process of containerizing and running scripts (Python, Bash, Node.js) using AI-generated Dockerfiles. This tool reads your script and its usage example, generates a best-practice Dockerfile via an LLM (like OpenAI GPT-4), builds the Docker image, and runs your script in a container—all in one step.

## Features
- **Automatic Dockerfile Generation:** Uses an LLM to create a Dockerfile tailored to your script and its usage.
- **Supports Multiple Languages:** Python, Bash, and Node.js scripts.
- **End-to-End Automation:** Reads script, generates Dockerfile, builds image, and runs the container.
- **Input Sanitization:** Prevents dangerous or forbidden content from being processed.
- **Extensible:** Easily add your own scripts and usage examples.

## Requirements
- Node.js (v18+ recommended)
- Docker
- Python 3.x (for Python scripts)
- Bash (for shell scripts)
- OpenAI API key (or compatible LLM provider)

## Installation
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd ai-docker-wrapper
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env` and add your OpenAI API key:
     ```env
     OPENAI_API_KEY=your-key-here
     LLM_PROVIDER=openai
     ```

## Usage
1. Choose or add your script and its README (see below).
2. In `index.js`, set the `scriptPath` and `readmePath` to your script and its README.
3. Run the wrapper:
   ```bash
   node index.js
   ```
   The tool will:
   - Read your script and its README
   - Extract a usage example
   - Generate a Dockerfile using the LLM
   - Build the Docker image
   - Run the container with the example arguments

### Example
For the provided Python word reverser:
```js
// In index.js:
const scriptPath = './scripts/word_reverser.py';
const readmePath = './scripts/README_word_reverser.md';
```
Run:
```bash
node index.js
```

## Adding Your Own Script
1. Place your script in the `scripts/` directory.
2. Write a README for your script in Markdown, including a `## Usage` section with a code block showing how to run it.
3. Update `index.js` to point to your script and README.
4. Run the wrapper as above.

## Safety Notes
- The tool sanitizes input to block dangerous commands (e.g., `rm -rf`, `shutdown`, etc.).
- Only use scripts and usage examples you trust.
- Review generated Dockerfiles before deploying to production.

## License
MIT 
