'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeUrl } from '@/app/actions';
import type { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, BotMessageSquare, Code, FileText, Gauge, Zap, Clock, Shield, HelpCircle, Search, Expand, Download, ChevronRight, ChevronDown, Server, Fingerprint, Network } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';


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
        
        if (typeL !== 'all') {
            if (typeL === 'images') {
                typeMatch = itemType === 'img';
            } else if (resourceTypes.map(t => t.toLowerCase()).includes(typeL)) {
                typeMatch = itemType === typeL;
            } else {
                 typeMatch = false;
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

function SummaryTabContent({ data }: { data: AnalysisResult }) {
    return (
        <div className="space-y-6">
            <SpeedVisualization />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TopIssues />
                </div>
                <div className="space-y-6">
                    <PageDetails />
                    <ServerDetails />
                </div>
            </div>
        </div>
    );
}

function SpeedVisualization() {
    const events = [
        { name: 'TTFB', time: 36, duration: 0, left: '1%' },
        { name: 'Onload Time', time: 721, duration: 0, left: '15%' },
        { name: 'First Contentful Paint', time: 4700, duration: 0, left: '95%', color: 'bg-blue-500' },
        { name: 'Largest Contentful Paint', time: 4700, duration: 0, left: '95%', color: 'bg-green-500' },
        { name: 'Time to Interactive', time: 4700, duration: 0, left: '95%', color: 'bg-purple-500' },
        { name: 'Fully Loaded Time', time: 4700, duration: 0, left: '95%', color: 'bg-red-500' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Speed Visualization</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative h-24 w-full rounded-lg bg-muted">
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
                        <span>0.6s</span>
                        <span>1.2s</span>
                        <span>1.8s</span>
                        <span>2.3s</span>
                        <span>2.9s</span>
                        <span>3.5s</span>
                        <span>4.1s</span>
                        <span>4.7s</span>
                    </div>

                    <div className="absolute inset-x-0 top-8 h-12 flex items-center">
                        <div className="w-full h-full flex">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex-1 border-r border-dashed border-border last:border-r-0"></div>
                            ))}
                        </div>
                    </div>
                     <div className="absolute inset-x-0 top-8 h-12 flex items-center">
                         <div className="absolute h-12 bg-gray-200 dark:bg-gray-700 rounded-md" style={{ left: '1%', width: '14%' }}>
                            <div className='p-1'>
                               <p className="text-xs font-bold">TTFB: 36ms</p>
                               <p className="text-xs text-muted-foreground">Redirect: 0ms</p>
                            </div>
                        </div>
                         <div className="absolute h-12 bg-gray-200 dark:bg-gray-700 rounded-md" style={{ left: '15%', width: '15%'}}>
                            <div className='p-1'>
                               <p className="text-xs font-bold">Onload Time: 721ms</p>
                            </div>
                         </div>
                     </div>
                </div>
                 <div className="mt-2 space-y-1">
                    {events.slice(2).map(event => (
                        <div key={event.name} className="flex items-center">
                            <div className={cn("w-4 h-2 rounded-sm mr-2", event.color)}></div>
                            <span className="text-sm font-medium">{event.name}: {event.time/1000}s</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

const topIssuesData = [
    {
        severity: 'High',
        title: 'Avoid enormous network payloads',
        tag: 'LCP',
        details: 'Total size was 18.0MB',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50',
        content: {
            description: 'Large network payloads cost users real money and are highly correlated with long load times.',
            urls: [
                { url: 'https://masumhasan.github.io/files/videos/coding.mp4', size: '3.59MB' },
                { url: 'https://masumhasan.github.io/files/images/works/gg.gif', size: '2.02MB' },
                { url: 'https://masumhasan.github.io/files/images/contacts.gif', size: '1.66MB' },
            ]
        }
    },
    {
        severity: 'Med',
        title: 'Avoid large layout shifts',
        tag: 'CLS',
        details: '15 layout shifts found',
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50',
        content: null
    },
    {
        severity: 'Med-Low',
        title: 'Use explicit width and height on image elements',
        tag: 'CLS',
        details: '18 images found',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50',
        content: null
    },
     {
        severity: 'Med-Low',
        title: 'Serve static assets with an efficient cache policy',
        details: 'Potential savings of 14.9MB',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50',
        content: null
    },

];


function TopIssues() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Issues</CardTitle>
                <CardDescription>These audits are identified as the top issues impacting your performance.</CardDescription>
                <div className="pt-2">
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="fcp">FCP</TabsTrigger>
                            <TabsTrigger value="lcp">LCP</TabsTrigger>
                            <TabsTrigger value="tbt">TBT</TabsTrigger>
                            <TabsTrigger value="cls">CLS</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                    {topIssuesData.map((issue, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className={cn("my-2 border rounded-lg", issue.color)}>
                            <AccordionTrigger className="p-4 text-left hover:no-underline">
                                <div className="flex items-center gap-4 w-full">
                                    <Badge variant="destructive" className="h-6">{issue.severity}</Badge>
                                    <span className="font-semibold flex-1">{issue.title} {issue.tag && <Badge variant="outline" className="ml-2">{issue.tag}</Badge>}</span>
                                    <span className="text-sm text-muted-foreground mr-4">{issue.details}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="p-4 pt-0">
                                {issue.content && (
                                    <>
                                        <p className="mb-4">{issue.content.description}</p>
                                        <div className="border rounded-md">
                                             <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>URL</TableHead>
                                                        <TableHead className="text-right">Transfer Size</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {issue.content.urls.map(item => (
                                                        <TableRow key={item.url}>
                                                            <TableCell className="font-medium truncate max-w-xs"><a href="#" className="hover:underline">{item.url}</a></TableCell>
                                                            <TableCell className="text-right">{item.size}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <Button variant="link" className="px-0 mt-2">Learn how to improve this</Button>
                                    </>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

function PageDetails() {
    const data = [
        { name: 'IMG', value: 13.2, color: 'bg-blue-500' },
        { name: 'Video', value: 4.62, color: 'bg-sky-500' },
    ];
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    const requestData = [
        { name: 'IMG', value: 66.2, color: 'bg-blue-500' },
        { name: 'Other', value: 14.9, color: 'bg-gray-400' },
        { name: 'JS', value: 8.1, color: 'bg-yellow-400' },
        { name: 'CSS', value: 6.4, color: 'bg-purple-500' },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Page Details</CardTitle>
                <CardDescription>Pages with smaller total sizes and fewer requests tend to load faster.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold">4.7s</h4>
                            <p className="text-sm text-muted-foreground">Fully Loaded Time</p>
                        </div>
                        <Progress value={100} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Total Page Size - 17.9MB</h4>
                        <div className="flex w-full h-8 rounded-md overflow-hidden">
                            {data.map(item => (
                                <div key={item.name} className={cn("flex items-center justify-center text-white text-xs font-bold", item.color)} style={{ width: `${(item.value / total) * 100}%` }}>
                                    {item.name} {item.value}MB
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Total Page Requests - 74</h4>
                        <div className="flex w-full h-8 rounded-md overflow-hidden">
                             {requestData.map(item => (
                                <div key={item.name} className={cn("flex items-center justify-center text-white text-xs font-bold", item.color)} style={{ width: `${item.value}%` }}>
                                    {item.name} {item.value}%
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Look into reducing JavaScript, reducing web-fonts, and image optimization to ensure a lightweight and streamlined website.</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ServerDetails() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Server Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span>IP Address</span>
                    </div>
                    <span className="font-mono text-sm">172.67.173.237</span>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        <span>Nameservers</span>
                    </div>
                    <div className="text-right">
                        <span className="font-mono text-sm">chloe.ns.cloudflare.com</span><br/>
                        <span className="font-mono text-sm">major.ns.cloudflare.com</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span>Powered By</span>
                    </div>
                    <span className="font-mono text-sm">Cloudflare</span>
                </div>
            </CardContent>
        </Card>
    )
}

function ResultsDisplay({ data }: { data: AnalysisResult }) {
    const { unusedCode } = data;

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
                 <SummaryTabContent data={data} />
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
                <UnusedCodeAnalysis unusedCode={unusedCode} />
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
