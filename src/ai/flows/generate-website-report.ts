'use server';

/**
 * @fileOverview Generates a comprehensive website performance and structure report.
 * - generateWebsiteReport - A function that handles the report generation.
 * - GenerateWebsiteReportInput - The input type for the function.
 * - GenerateWebsiteReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteReportInputSchema = z.object({
  url: z.string().url().describe('The URL of the web page to analyze.'),
});
export type GenerateWebsiteReportInput = z.infer<typeof GenerateWebsiteReportInputSchema>;

const DetectUnusedCodeOutputSchema = z.object({
  unusedCssPercentage: z.number().describe('The percentage of unused CSS.'),
  unusedJsPercentage: z.number().describe('The percentage of unused JavaScript.'),
  optimizationSuggestions: z.string().describe('Actionable recommendations for optimizing the web page.'),
});
export type DetectUnusedCodeOutput = z.infer<typeof DetectUnusedCodeOutputSchema>;

const PerformanceMetricSchema = z.object({
    title: z.string(),
    value: z.string(),
    description: z.string(),
    rating: z.enum(['Good', 'Needs Improvement', 'Poor']),
});

const BrowserTimingSchema = z.object({
    name: z.string(),
    value: z.string(),
});

const WaterfallItemSchema = z.object({
    url: z.string().url(),
    status: z.number(),
    domain: z.string(),
    size: z.string(),
    time: z.number().describe("Time in milliseconds"),
    start: z.number().describe("Start time in milliseconds"),
    type: z.enum(['html', 'css', 'js', 'image', 'font', 'xhr', 'other', 'script']),
});

const TopIssueSchema = z.object({
    severity: z.enum(['High', 'Medium', 'Low']),
    title: z.string(),
    tag: z.string().optional(),
    details: z.string(),
    content: z.object({
        description: z.string(),
        urls: z.array(z.object({
            url: z.string(),
            size: z.string()
        })).optional()
    }).nullable(),
});

const PageDetailsSchema = z.object({
    fullyLoadedTime: z.string(),
    totalPageSize: z.string(),
    totalPageRequests: z.number(),
    totalPageSizeBreakdown: z.array(z.object({ name: z.string(), value: z.number().describe("Size in MB"), color: z.string().describe("A background color class from Tailwind, e.g., bg-blue-500") })),
    totalPageRequestsBreakdown: z.array(z.object({ name: z.string(), value: z.number().describe("Percentage"), color: z.string().describe("A background color class from Tailwind, e.g., bg-blue-500") })),
});

const ServerDetailsSchema = z.object({
    ipAddress: z.string().ip(),
    nameservers: z.array(z.string()),
    poweredBy: z.string(),
});


const GenerateWebsiteReportOutputSchema = z.object({
  performanceScore: z.number().min(0).max(100).describe("A score from 0-100 for the website's performance."),
  webVitals: z.object({
    lcp: z.string().describe("Largest Contentful Paint, in seconds."),
    cls: z.string().describe("Cumulative Layout Shift score."),
    tbt: z.string().describe("Total Blocking Time, in milliseconds."),
  }),
  unusedCode: DetectUnusedCodeOutputSchema.describe("Analysis of unused CSS and JavaScript."),
  performanceMetrics: z.array(PerformanceMetricSchema).describe("An array of performance metrics like FCP, TTI, Speed Index."),
  browserTimings: z.array(BrowserTimingSchema).describe("An array of browser-reported timings like TTFB, DOM Interactive."),
  waterfall: z.array(WaterfallItemSchema).describe("A waterfall chart of network requests. Should contain between 20 to 40 realistic items for a typical webpage."),
  topIssues: z.array(TopIssueSchema).describe("A list of the top 3-5 performance issues found."),
  pageDetails: PageDetailsSchema.describe("Details about the page size and request counts."),
  serverDetails: ServerDetailsSchema.describe("Details about the web server hosting the URL."),
});
export type GenerateWebsiteReportOutput = z.infer<typeof GenerateWebsiteReportOutputSchema>;

export async function generateWebsiteReport(input: GenerateWebsiteReportInput): Promise<GenerateWebsiteReportOutput> {
  return generateWebsiteReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteReportPrompt',
  input: {schema: GenerateWebsiteReportInputSchema},
  output: {schema: GenerateWebsiteReportOutputSchema},
  prompt: `You are a world-class web performance analysis engine. Your task is to analyze the provided URL and generate a comprehensive performance report. You must simulate a real performance analysis tool like Google Lighthouse or GTmetrix.

URL to analyze: {{{url}}}

Based on the URL, generate a complete and realistic report covering all aspects of the output schema. The data should be plausible and reflect what you might expect from a real-world website. For example, if the URL is for a simple blog, the waterfall chart should be smaller than for a complex e-commerce site.

- **performanceScore**: Generate a score between 0 and 100.
- **webVitals**: Generate realistic LCP, CLS, and TBT values.
- **unusedCode**: Provide a reasonable estimate for unused code percentages and actionable suggestions.
- **performanceMetrics**: Create a list of key performance metrics. The values and ratings should be consistent with the overall performance score.
- **browserTimings**: Generate a list of browser timings.
- **waterfall**: Create a realistic waterfall chart with 20-40 requests, including HTML, CSS, JS, images, and fonts. Times should be sequential and logical. Use a variety of domains.
- **topIssues**: Identify 3-5 top performance issues based on your analysis. The issues should be specific and actionable.
- **pageDetails**: Calculate total page size, request count, and provide a breakdown by content type.
- **serverDetails**: Provide plausible server details, including a public IP, common nameservers (like Cloudflare, AWS, etc.), and the server technology.

Ensure all fields in the output schema are populated with high-quality, realistic data. The entire output must be a single JSON object matching the defined schema.
`,
});

const generateWebsiteReportFlow = ai.defineFlow(
  {
    name: 'generateWebsiteReportFlow',
    inputSchema: GenerateWebsiteReportInputSchema,
    outputSchema: GenerateWebsiteReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The model failed to generate a report.");
    }
    return output;
  }
);

