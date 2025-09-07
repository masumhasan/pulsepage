'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeUrl } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, BotMessageSquare, Code, FileText, Gauge, Zap, Clock, Shield, HelpCircle, Search, Expand, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ResultsLoading from './loading';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';


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

const performanceMetricsData = [
    { title: 'First Contentful Paint', value: '4.4s', description: 'How quickly content like text or images are painted onto your page. A good user experience is 0.9s or less.', rating: 'Much longer than recommended', ratingColor: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
    { title: 'Time to Interactive', value: '4.4s', description: 'How long it takes for your page to become fully interactive. A good user experience is 2.5s or less.', rating: 'Longer than recommended', ratingColor: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    { title: 'Speed Index', value: '2.2s', description: 'How quickly the contents of your page are visibly populated. A good user experience is 1.3s or less.', rating: 'Longer than recommended', ratingColor: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    { title: 'Total Blocking Time', value: '0ms', description: 'How much time is blocked by scripts during your page loading process. A good user experience is 150ms or less.', rating: 'Good - Nothing to do here', ratingColor: 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    { title: 'Largest Contentful Paint', value: '4.4s', description: 'How long it takes for the largest element of content (i.e., a hero image) to be painted on your page. A good user experience is 1.2s or less.', rating: 'Much longer than recommended', ratingColor: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
    { title: 'Cumulative Layout Shift', value: '0.5', description: 'How much your page\'s layout shifts as it loads. A good user experience is a score of 0.1 or less.', rating: 'Much longer than recommended', ratingColor: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
];

const browserTimingsData = [
    { name: 'Redirect Duration', value: '0ms' },
    { name: 'Connection Duration', value: '24ms' },
    { name: 'Backend Duration', value: '5ms' },
    { name: 'Time to First Byte (TTFB)', value: '29ms' },
    { name: 'DOM Interactive Time', value: '458ms' },
    { name: 'DOM Content Loaded Time', value: '475ms' },
    { name: 'First Paint', value: '789ms' },
    { name: 'Onload Time', value: '1.1s' },
    { name: 'Fully Loaded Time', value: '4.4s' },
];

function PerformanceMetricCard({ metric }: { metric: typeof performanceMetricsData[0] }) {
    const borderColor = {
        'Much longer than recommended': 'border-l-red-400',
        'Longer than recommended': 'border-l-yellow-400',
        'Good - Nothing to do here': 'border-l-green-400',
    }[metric.rating] || 'border-l-gray-400';

    return (
        <Card className={cn("overflow-hidden", borderColor, 'border-l-4')}>
            <CardContent className="p-0">
                <div className="flex">
                    <div className="p-4 flex-1">
                        <CardTitle className="text-lg font-semibold">{metric.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                            {metric.description} <a href="#" className="text-primary hover:underline">Learn more.</a>
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 min-w-[120px]">
                        <div className={cn("px-2 py-0.5 text-xs rounded-t-md w-full text-center", metric.ratingColor)}>
                            {metric.rating}
                        </div>
                        <div className={cn("text-3xl font-bold w-full text-center py-2 rounded-b-md", metric.ratingColor.replace(/bg-(red|yellow|green)-200/, 'bg-$1-100 dark:bg-$1-900/30'))}>
                            {metric.value}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BrowserTimingCard({ timing }: { timing: typeof browserTimingsData[0] }) {
    return (
        <Card className="border-l-4 border-l-muted-foreground/50">
            <CardContent className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{timing.name}</p>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>This timing is a milestone reported by the browser.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <p className="text-lg font-semibold">{timing.value}</p>
            </CardContent>
        </Card>
    );
}


function PerformanceTabContent() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>The following metrics are generated using Lighthouse Performance data.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="metric-details" />
                            <label htmlFor="metric-details" className="text-sm font-medium">Metric details</label>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {performanceMetricsData.map(metric => <PerformanceMetricCard key={metric.title} metric={metric} />)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Browser Timings</CardTitle>
                    <CardDescription>These timings are milestones reported by the browser.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {browserTimingsData.map(timing => <BrowserTimingCard key={timing.name} timing={timing} />)}
                </CardContent>
            </Card>
        </div>
    );
}


const waterfallData = [
    { url: '/', status: 200, domain: 'masumhasan.github.io', size: '7.71KB', time: 30, type: 'html', start: 0 },
    { url: 'css2?family=Oxygen:wght@3...', status: 200, domain: 'fonts.googleapis.com', size: '890B', time: 76, type: 'css', start: 30 },
    { url: 'bulma.css', status: 200, domain: 'masumhasan.github.io', size: '29.7KB', time: 176, type: 'css', start: 35 },
    { url: 'style.css', status: 200, domain: 'masumhasan.github.io', size: '5.91KB', time: 84, type: 'css', start: 40 },
    { url: 'custom.css', status: 200, domain: 'masumhasan.github.io', size: '377B', time: 85, type: 'js', start: 42 },
    { url: 'favdark.png', status: 200, domain: 'masumhasan.github.io', size: '327B', time: 110, type: 'img', start: 100 },
    { url: '512.webp', status: 200, domain: 'fonts.gstatic.com', size: '181KB', time: 125, type: 'img', start: 110 },
    { url: '512.webp', status: 200, domain: 'fonts.gstatic.com', size: '101KB', time: 108, type: 'img', start: 150 },
    { url: 'firebase.png', status: 200, domain: 'masumhasan.github.io', size: '2.70KB', time: 99, type: 'img', start: 180 },
    { url: '512.webp', status: 200, domain: 'fonts.gstatic.com', size: '575KB', time: 107, type: 'img', start: 200 },
    { url: 'research3d.gif', status: 200, domain: 'masumhasan.github.io', size: '799KB', time: 458, type: 'img', start: 210 },
    { url: 'design3d.gif', status: 200, domain: 'masumhasan.github.io', size: '859KB', time: 575, type: 'img', start: 220 },
    { url: 'bulb3d.gif', status: 200, domain: 'masumhasan.github.io', size: '608KB', time: 732, type: 'img', start: 230 },
    { url: 'rocket3d.gif', status: 200, domain: 'masumhasan.github.io', size: '694KB', time: 347, type: 'img', start: 250 },
    { url: 'bridgescore.png', status: 200, domain: 'masumhasan.github.io', size: '289KB', time: 152, type: 'img', start: 280 },
    { url: 'baymaxt.gif', status: 200, domain: 'masumhasan.github.io', size: '1.09MB', time: 300, type: 'img', start: 300 },
    { url: 'today-milk.jpg', status: 503, domain: 'masumhasan.github.io', size: '53.6KB', time: 145, type: 'img', start: 400 },
];

const resourceTypes = ['All', 'HTML', 'JS', 'CSS', 'Images', 'Video', 'XHR', 'Fonts', 'Other'];
const resourceTypeColors: { [key: string]: string } = {
    html: 'hsl(var(--primary))',
    css: 'hsl(140, 70%, 45%)',
    js: 'hsl(50, 80%, 55%)',
    img: 'hsl(var(--primary))',
    default: 'hsl(var(--muted-foreground))'
}

const summaryChartData = [
  { name: 'CPU', value: 96.8, fill: 'hsl(var(--destructive))' },
  { name: 'Memory', value: 75, fill: 'hsl(var(--primary))' },
  { name: 'Bandwidth', value: 50, fill: 'hsl(var(--accent-foreground))' },
];


function WaterfallTabContent() {
    const [filter, setFilter] = useState('');
    const [activeType, setActiveType] = useState('All');

    const filteredData = waterfallData.filter(item => {
        const typeL = activeType.toLowerCase();
        const itemType = item.type.toLowerCase();
        let typeMatch = true;
        if (activeType !== 'All') {
            switch(typeL) {
                case 'images':
                    typeMatch = itemType === 'img';
                    break;
                case 'html':
                case 'js':
                case 'css':
                case 'video':
                case 'xhr':
                case 'fonts':
                case 'other':
                    typeMatch = itemType === typeL;
                    break;
                default:
                    typeMatch = itemType === typeL;
            }
        }
        
        const filterMatch = item.url.toLowerCase().includes(filter.toLowerCase());
        return typeMatch && filterMatch;
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Waterfall Chart</CardTitle>
                        <CardDescription>
                            A request-by-request visualization of the page load. <a href="#" className="text-primary hover:underline">Learn how to read a waterfall chart.</a>
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Button variant="outline" size="sm"><Expand className="h-4 w-4 mr-2" />Fullscreen</Button>
                        <Button variant="default" size="sm"><Download className="h-4 w-4 mr-2" />Download HAR</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Filter requests..." 
                            className="pl-8" 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {resourceTypes.map(type => (
                            <Button 
                                key={type} 
                                variant={activeType === type ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setActiveType(type)}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[1200px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">URL</TableHead>
                                    <TableHead className="w-[80px]">Status</TableHead>
                                    <TableHead className="w-[200px]">Domain</TableHead>
                                    <TableHead className="w-[100px]">Size</TableHead>
                                    <TableHead>Timeline</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                        <div className="h-[600px] overflow-y-auto">
                           <Table className="min-w-[1200px]">
                            <TableBody>
                                {filteredData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="w-[400px] font-medium truncate">
                                            <div className="flex items-center">
                                                <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="truncate">{item.url}</span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{item.url}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[80px]">
                                            <span className={cn('px-2 py-1 text-xs rounded-full', item.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{item.status}</span>
                                        </TableCell>
                                        <TableCell className="w-[200px] truncate">{item.domain}</TableCell>
                                        <TableCell className="w-[100px]">{item.size}</TableCell>
                                        <TableCell>
                                            <div className="w-full h-6 bg-muted rounded-sm overflow-hidden relative">
                                                <div 
                                                    className="h-full absolute"
                                                    style={{ 
                                                        left: `${(item.start / 1000) * 20}%`, 
                                                        width: `${(item.time / 1000) * 20}%`,
                                                        backgroundColor: resourceTypeColors[item.type as keyof typeof resourceTypeColors] || resourceTypeColors.default
                                                     }}
                                                ></div>
                                                 <span className="absolute right-2 top-0.5 text-xs text-foreground z-10">{item.time}ms</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                           </Table>
                        </div>
                    </div>
                     <div className="flex justify-between items-center p-2 text-sm font-medium border-t bg-muted/50">
                        <p>78 Requests</p>
                        <p>24.5MB (25.1MB Uncompressed)</p>
                        <p>Fully Loaded 4.4s (Onload 1.1s)</p>
                    </div>
                     <div className="h-[120px] p-4 border-t">
                         <TooltipProvider>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={summaryChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))'
                                    }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorCpu)" />
                                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMemory)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </TooltipProvider>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
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
            
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="pt-6">
                <div className="space-y-6">
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
                        <Link href="/">
                            <Button>Analyze Another URL</Button>
                        </Link>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="pt-6">
                 <PerformanceTabContent />
              </TabsContent>
              <TabsContent value="structure" className="pt-6">
                <Card>
                    <CardHeader><CardTitle>Structure</CardTitle></CardHeader>
                    <CardContent><p>Structure details coming soon.</p></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="waterfall" className="pt-6">
                <WaterfallTabContent />
              </TabsContent>
              <TabsContent value="optimization" className="pt-6">
                 <Card>
                    <CardHeader><CardTitle>Optimization</CardTitle></CardHeader>
                    <CardContent><p>Optimization details coming soon.</p></CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
                        <Link href="/" className='mt-4 block'>
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
                 <Link href="/" className='mt-4 block'>
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

    