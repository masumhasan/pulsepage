'use server';

/**
 * @fileOverview Detects and quantifies unused CSS and JavaScript on a given URL.
 *
 * - detectUnusedCode - A function that handles the detection of unused code.
 * - DetectUnusedCodeInput - The input type for the detectUnusedCode function.
 * - DetectUnusedCodeOutput - The return type for the detectUnusedCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectUnusedCodeInputSchema = z.object({
  url: z.string().url().describe('The URL of the web page to analyze.'),
  coverageData: z.string().describe('The coverage data from the webpage.'),
});
export type DetectUnusedCodeInput = z.infer<typeof DetectUnusedCodeInputSchema>;

const DetectUnusedCodeOutputSchema = z.object({
  unusedCssPercentage: z.number().describe('The percentage of unused CSS.'),
  unusedJsPercentage: z.number().describe('The percentage of unused JavaScript.'),
  optimizationSuggestions: z.string().describe('Actionable recommendations for optimizing the web page.'),
});
export type DetectUnusedCodeOutput = z.infer<typeof DetectUnusedCodeOutputSchema>;

export async function detectUnusedCode(input: DetectUnusedCodeInput): Promise<DetectUnusedCodeOutput> {
  return detectUnusedCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectUnusedCodePrompt',
  input: {schema: DetectUnusedCodeInputSchema},
  output: {schema: DetectUnusedCodeOutputSchema},
  prompt: `You are an expert web performance consultant. Analyze the following webpage coverage data and provide the percentage of unused CSS and JavaScript. Also, provide actionable recommendations for optimizing the web page.

URL: {{{url}}}
Coverage Data: {{{coverageData}}}

Based on this data, determine the percentage of unused CSS and JavaScript, and suggest specific optimization strategies. Focus on removing or deferring unused code to improve loading times.
`,
});

const detectUnusedCodeFlow = ai.defineFlow(
  {
    name: 'detectUnusedCodeFlow',
    inputSchema: DetectUnusedCodeInputSchema,
    outputSchema: DetectUnusedCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
