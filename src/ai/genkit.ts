import {genkit} from 'genkit';
import {googleAI} from '@gen-ai/google-ai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
