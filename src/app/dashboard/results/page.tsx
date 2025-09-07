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
import Image from 'next/image';

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
                                <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/26a1/512.webp" alt="Zap" width={20} height={20} />
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
     try {
        const reportData = JSON.parse(report.report);

        const metricColors: { [key: string]: string } = {
            good: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            needs_improvement: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };

        return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp" alt="Bot" width={24} height={24} />
                    <CardTitle>AI-Generated Detailed Report</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {Object.entries(reportData).map(([section, data]: [string, any]) => (
                    <Card key={section} className="bg-background/50">
                        <CardHeader>
                            <CardTitle className="text-lg capitalize">{section.replace(/_/g, ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Array.isArray(data) ? (
                                <ul className="space-y-2">
                                    {data.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(data).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                            {typeof value === 'object' ? (
                                                <span className={`px-2 py-1 text-xs rounded-full ${metricColors[value.rating] || 'bg-gray-200 text-gray-800'}`}>
                                                    {value.value}
                                                </span>
                                            ) : (
                                                <span>{String(value)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
        );

    } catch (e) {
        // Fallback for non-JSON reports
        return (
             <Card>
                <CardHeader>
                     <div className="flex items-center gap-2">
                        <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp" alt="Bot" width={24} height={24} />
                        <CardTitle>AI-Generated Detailed Report</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                     <p>{report.report}</p>
                </CardContent>
            </Card>
        )
    }
}

function ResultsDisplay({ data }: { data: AnalysisResult }) {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">Analysis Results</h1>
                    <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f973/512.webp" alt="Party" width={32} height={32} />
                </div>
                <p className="text-muted-foreground break-all">For: <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{data.url}</a></p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PerformanceScore score={data.performanceScore} />
                <WebVital title="Largest Contentful Paint" value={data.webVitals.lcp} Icon={Clock} />
                <WebVital title="Cumulative Layout Shift" value={data.webVitals.cls} Icon={Shield} />
                <WebVital title="Total Blocking Time" value={data.webVitals.tbt} Icon={FileText} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
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
                         <div className='flex justify-center mb-4'>
                            <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.webp" alt="Sad face" width={48} height={48} />
                         </div>
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
                 <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f937_200d_2642/512.webp" alt="Shrug" width={64} height={64} />
                <p className='mt-4'>No results to display.</p>
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
