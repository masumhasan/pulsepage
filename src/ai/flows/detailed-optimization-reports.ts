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
  report: z.string().describe('A detailed report with page speed metrics and actionable optimization recommendations.'),
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

Report:
`, // Ensure the output contains the report
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
