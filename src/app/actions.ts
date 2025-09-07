'use server';

import type { AnalysisResult } from '@/lib/types';
import { generateWebsiteReport } from '@/ai/flows/generate-website-report';

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
    try {
        if (!url.startsWith('http://') && !url.startsWith('https')) {
            url = `https://${url}`;
        }
        // Validate URL format
        new URL(url);

        const report = await generateWebsiteReport({ url });

        return {
            ...report,
            url: url
        };

    } catch (error) {
        console.error("Analysis failed:", error);

        if (error instanceof TypeError) {
             throw new Error("Invalid URL. Please enter a valid URL format (e.g., example.com).");
        }

        throw new Error("Failed to analyze the URL. The AI model may be overloaded. Please try again later.");
    }
}
