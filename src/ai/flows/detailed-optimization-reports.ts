'use server';

/**
 * @fileOverview Provides detailed reports with page speed metrics and actionable optimization recommendations.
 *
 * - generateDetailedReport - A function to generate a detailed optimization report for a given URL.
 * - DetailedReportInput - The input type for the generateDetailedReport function, including the URL and coverage data.
 * - DetailedReportOutput - The return type for the generateDetailedReport function, containing the report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetailedReportInputSchema = z.object({
  url: z.string().describe('The URL of the page to analyze.'),
  coverageData: z.string().describe('The coverage data for the URL.'),
});
export type DetailedReportInput = z.infer<typeof DetailedReportInputSchema>;

const DetailedReportOutputSchema = z.object({
  report: z.string().describe('A detailed report with page speed metrics and actionable optimization recommendations in JSON format.'),
});
export type DetailedReportOutput = z.infer<typeof DetailedReportOutputSchema>;

export async function generateDetailedReport(input: DetailedReportInput): Promise<DetailedReportOutput> {
  return detailedReportFlow(input);
}

const detailedReportPrompt = ai.definePrompt({
  name: 'detailedReportPrompt',
  input: {schema: DetailedReportInputSchema},
  output: {schema: DetailedReportOutputSchema},
  prompt: `You are an expert web performance consultant. Analyze the following web page and coverage data and provide a detailed report with page speed metrics and actionable optimization recommendations.

URL: {{{url}}}
Coverage Data: {{{coverageData}}}

Return the report as a JSON object with the following structure:
{
  "page_speed_metrics": {
    "first_contentful_paint": { "value": "1.2s", "rating": "good" },
    "speed_index": { "value": "2.5s", "rating": "needs_improvement" },
    "time_to_interactive": { "value": "3.8s", "rating": "poor" }
  },
  "image_optimizations": [
    "Compress and resize images to reduce file size.",
    "Use modern image formats like WebP.",
    "Implement lazy loading for offscreen images."
  ],
  "resource_loading": [
    "Minify CSS, JavaScript, and HTML.",
    "Remove unused CSS.",
    "Leverage browser caching."
  ]
}

The "rating" should be one of "good", "needs_improvement", or "poor".
Provide real, actionable recommendations based on general web performance best practices. The provided coverage data is a placeholder.
`,
});

const detailedReportFlow = ai.defineFlow(
  {
    name: 'detailedReportFlow',
    inputSchema: DetailedReportInputSchema,
    outputSchema: DetailedReportOutputSchema,
  },
  async input => {
    const {output} = await detailedReportPrompt(input);
    return output!;
  }
);
