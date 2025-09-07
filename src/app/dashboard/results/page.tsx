'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeUrl } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, BotMessageSquare, Code, FileText, Gauge, Zap, Clock, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ResultsLoading from './loading';


function PerformanceScore({ score }: { score: number }) {
    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-green-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
                <p className="text-xs text-muted-foreground">out of 100</p>
                <Progress value={score} className="mt-4 h-2" />
            </CardContent>
        </Card>
    );
}

function WebVital({ title, value, Icon }: { title: string; value: string; Icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

function UnusedCodeAnalysis({ unusedCode }: { unusedCode: AnalysisResult['unusedCode'] }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    <CardTitle>Unused Code Detection</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-red-500">{unusedCode.unusedCssPercentage.toFixed(2)}%</p>
                        <p className="text-sm text-muted-foreground">Unused CSS</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-500">{unusedCode.unusedJsPercentage.toFixed(2)}%</p>
                        <p className="text-sm text-muted-foreground">Unused JavaScript</p>
                    </div>
                </div>
                <Accordion type="single" collapsible>
                    <AccordionItem value="suggestions">
                        <AccordionTrigger className="text-base">
                            <div className='flex items-center gap-2'>
                                <Zap className="h-5 w-5" />
                                Optimization Suggestions
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                            <p>{unusedCode.optimizationSuggestions}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}

function DetailedReport({ report }: { report: AnalysisResult['detailedReport'] }) {
    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <BotMessageSquare className="h-6 w-6" />
                    <CardTitle>AI-Generated Detailed Report</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                 <p>{report.report}</p>
            </CardContent>
        </Card>
    );
}

function ResultsDisplay({ data }: { data: AnalysisResult }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Analysis Results</h1>
                <p className="text-muted-foreground break-all">For: <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{data.url}</a></p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PerformanceScore score={data.performanceScore} />
                <WebVital title="Largest Contentful Paint" value={data.webVitals.lcp} Icon={Clock} />
                <WebVital title="Cumulative Layout Shift" value={data.webVitals.cls} Icon={Shield} />
                <WebVital title="Total Blocking Time" value={data.webVitals.tbt} Icon={FileText} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <UnusedCodeAnalysis unusedCode={data.unusedCode} />
                <DetailedReport report={data.detailedReport} />
            </div>
             <div className="text-center pt-4">
                <Link href="/dashboard/inspect">
                    <Button>Analyze Another URL</Button>
                </Link>
            </div>
        </div>
    );
}


function ResultsPageContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!url) {
            setError("No URL provided for analysis.");
            setIsLoading(false);
            return;
        }

        const performAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const analysisResult = await analyzeUrl(url);
                setResult(analysisResult);
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        performAnalysis();
    }, [url]);

    if (isLoading) {
        return <ResultsLoading />;
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Analysis Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                        <Link href="/dashboard/inspect" className='mt-4 block'>
                            <Button>Try Again</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!result) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <p>No results to display.</p>
                 <Link href="/dashboard/inspect" className='mt-4 block'>
                    <Button>Start New Analysis</Button>
                </Link>
             </div>
        )
    }

    return <ResultsDisplay data={result} />;
}


export default function ResultsPage() {
    return (
        <Suspense fallback={<ResultsLoading />}>
            <ResultsPageContent />
        </Suspense>
    )
}
