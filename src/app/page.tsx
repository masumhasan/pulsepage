'use client';

import { useState } from 'react';
import type { AnalysisResult, WebVitals } from '@/lib/types';
import { analyzeUrl } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PagePulseIcon } from '@/components/icons';
import { Download, Gauge, Timer, Layers, Blocks, Code, FileText, Bot } from 'lucide-react';

const webVitalsMeta = {
  lcp: {
    Icon: Timer,
    name: 'Largest Contentful Paint',
    description: 'Measures loading performance.',
  },
  cls: {
    Icon: Layers,
    name: 'Cumulative Layout Shift',
    description: 'Measures visual stability.',
  },
  tbt: {
    Icon: Blocks,
    name: 'Total Blocking Time',
    description: 'Measures load responsiveness.',
  },
};

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        variant: 'destructive',
        title: 'URL is required',
        description: 'Please enter a URL to analyze.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeUrl(url);
      setResult(analysisResult);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const jsonString = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `pagepulse-report-${new URL(result.url).hostname}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex items-center gap-2">
          <PagePulseIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">PagePulse</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {!result && !loading && (
          <div className="text-center max-w-2xl mx-auto my-16">
            <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Instant Web Performance Analysis</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Enter a URL to get a detailed performance report, including Web Vitals, unused code detection, and AI-powered optimization tips.
            </p>
            <form onSubmit={handleAnalysis} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-base"
                required
              />
              <Button type="submit" size="lg" className="h-12 text-base font-semibold">
                Analyze
              </Button>
            </form>
          </div>
        )}

        {loading && <AnalysisSkeleton />}

        {result && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold font-headline">Analysis Report</h2>
                <p className="text-muted-foreground truncate max-w-md">{result.url}</p>
              </div>
              <Button onClick={downloadReport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-7xl font-bold ${getScoreColor(result.performanceScore)}`}>
                            {result.performanceScore}
                        </div>
                        <p className="text-xs text-muted-foreground">out of 100</p>
                    </CardContent>
                </Card>

                {Object.entries(result.webVitals).map(([key, value]) => {
                  const meta = webVitalsMeta[key as keyof WebVitals];
                  return (
                    <Card key={key} className="lg:col-span-1">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{meta.name}</CardTitle>
                        <meta.Icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{value}</div>
                        <p className="text-xs text-muted-foreground">{meta.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <UnusedCodeCard 
                    css={result.unusedCode.unusedCssPercentage} 
                    js={result.unusedCode.unusedJsPercentage} 
                />
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            AI Optimization Suggestions
                        </CardTitle>
                        <CardDescription>Powered by Google AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{result.unusedCode.optimizationSuggestions}</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Detailed AI Report
                    </CardTitle>
                    <CardDescription>In-depth analysis and recommendations from our AI consultant.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg font-semibold">View Full Report</AccordionTrigger>
                            <AccordionContent className="prose prose-invert max-w-none text-foreground/90 pt-4 whitespace-pre-wrap">
                                {result.detailedReport.report}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

          </div>
        )}
      </main>

      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <div className="container mx-auto">
            © {new Date().getFullYear()} PagePulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


function UnusedCodeCard({ css, js }: { css: number; js: number }) {
  const chartData = [
    { type: 'CSS', unused: css, fill: 'hsl(var(--chart-1))' },
    { type: 'JS', unused: js, fill: 'hsl(var(--chart-2))' },
  ];
  
  const chartConfig = {
    unused: { label: 'Unused' },
    css: { label: 'CSS', color: 'hsl(var(--chart-1))' },
    js: { label: 'JS', color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5" />Unused Code</CardTitle>
        <CardDescription>Percentage of unused CSS & JavaScript.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="unused"
                nameKey="type"
                innerRadius={60}
                strokeWidth={5}
              >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-around mt-4 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--chart-1))]"></span>
                <span>CSS: {css.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--chart-2))]"></span>
                <span>JS: {js.toFixed(1)}%</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
