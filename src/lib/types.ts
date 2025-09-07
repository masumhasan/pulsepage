import type { DetectUnusedCodeOutput, GenerateWebsiteReportOutput } from '@/ai/flows/generate-website-report';

export type WebVitals = {
  lcp: string;
  cls: string;
  tbt: string;
};

export type PerformanceMetric = {
    title: string;
    value: string;
    description: string;
    rating: 'Good' | 'Needs Improvement' | 'Poor';
};

export type BrowserTiming = {
    name: string;
    value: string;
};

export type WaterfallItem = {
    url: string;
    status: number;
    domain: string;
    size: string;
    time: number;
    start: number;
    type: 'html' | 'css' | 'js' | 'image' | 'font' | 'xhr' | 'other' | 'script';
};

export type TopIssue = {
    severity: 'High' | 'Medium' | 'Low';
    title: string;
    tag?: string;
    details: string;
    content: {
        description: string;
        urls: Array<{
            url: string;
            size: string;
        }>;
    } | null;
};

export type PageDetails = {
    fullyLoadedTime: string;
    totalPageSize: string;
    totalPageRequests: number;
    totalPageSizeBreakdown: Array<{ name: string; value: number; color: string }>;
    totalPageRequestsBreakdown: Array<{ name: string; value: number; color: string }>;
};

export type ServerDetails = {
    ipAddress: string;
    nameservers: string[];
    poweredBy: string;
};

export type AuditItem = {
    title: string;
    tag?: string;
    details: string;
    content?: {
        description: string;
        urls?: Array<{
            url: string;
            size: string;
        }>;
    };
};

export type StructureAuditGroup = {
    impact: 'High' | 'Medium' | 'Medium-Low' | 'Low' | 'Informational' | 'Passed';
    audits: AuditItem[];
};


export type AnalysisResult = GenerateWebsiteReportOutput & {
  url: string;
};
