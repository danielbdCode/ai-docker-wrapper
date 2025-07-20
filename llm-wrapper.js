import { config } from 'dotenv';
config();

const PROVIDER = process.env.LLM_PROVIDER || 'openai';

let provider;

if (PROVIDER === 'openai') {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  provider = async (prompt) => {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
    return res.choices[0].message.content.trim();
  };
}

export async function getCompletion(prompt) {
  return await provider(prompt);
}
