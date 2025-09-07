import type { DetectUnusedCodeOutput } from '@/ai/flows/unused-code-detection';
import type { DetailedReportOutput } from '@/ai/flows/detailed-optimization-reports';

export type WebVitals = {
  lcp: string;
  cls: string;
  tbt: string;
};

export type AnalysisResult = {
  performanceScore: number;
  webVitals: WebVitals;
  unusedCode: DetectUnusedCodeOutput;
  detailedReport: DetailedReportOutput;
  url: string;
};
