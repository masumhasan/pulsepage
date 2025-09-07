'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeUrl } from '@/app/actions';
import type { AnalysisResult, PerformanceMetric, BrowserTiming, WaterfallItem, TopIssue } from '@/lib/types';
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
import DashboardLayout from '../layout';


function UnusedCodeAnalysis({ unusedCode }: { unusedCode: AnalysisResult['unusedCode'] }) {
    if (!unusedCode) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Code className="h-6 w-6" />
                        <CardTitle>Unused Code Detection</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>Could not analyze unused code for this URL.</p>
                </CardContent>
            </Card>
        );
    }
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

function PerformanceMetricCard({ metric }: { metric: PerformanceMetric }) {
    const getRatingColor = (rating: string) => {
        switch (rating.toLowerCase()) {
            case 'good': return 'border-l-green-400';
            case 'needs improvement': return 'border-l-yellow-400';
            case 'poor': return 'border-l-red-400';
            default: return 'border-l-gray-400';
        }
    };
     const getRatingBgColor = (rating: string) => {
        switch (rating.toLowerCase()) {
            case 'good': return 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'needs improvement': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'poor': return 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return 'bg-gray-200 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
        }
    };

    return (
        <Card className={cn("overflow-hidden border-l-4", getRatingColor(metric.rating))}>
            <CardContent className="p-0">
                <div className="flex">
                    <div className="p-4 flex-1">
                        <CardTitle className="text-lg font-semibold">{metric.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                            {metric.description} <a href="#" className="text-primary hover:underline">Learn more.</a>
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 min-w-[120px]">
                        <div className={cn("px-2 py-0.5 text-xs rounded-t-md w-full text-center", getRatingBgColor(metric.rating))}>
                            {metric.rating}
                        </div>
                        <div className={cn("text-3xl font-bold w-full text-center py-2 rounded-b-md", getRatingBgColor(metric.rating).replace(/bg-(red|yellow|green)-200/, 'bg-$1-100 dark:bg-$1-900/30'))}>
                            {metric.value}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function BrowserTimingCard({ timing }: { timing: BrowserTiming }) {
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


function PerformanceTabContent({ data }: { data: AnalysisResult }) {
    const { performanceMetrics, browserTimings } = data;
    if (!performanceMetrics || !browserTimings) {
        return <Card><CardContent><p className='p-4'>Performance data not available for this URL.</p></CardContent></Card>
    }
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
                    {performanceMetrics.map(metric => <PerformanceMetricCard key={metric.title} metric={metric} />)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Browser Timings</CardTitle>
                    <CardDescription>These timings are milestones reported by the browser.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    {browserTimings.map(timing => <BrowserTimingCard key={timing.name} timing={timing} />)}
                </CardContent>
            </Card>
        </div>
    );
}

const resourceTypes = ['All', 'HTML', 'JS', 'CSS', 'Images', 'Video', 'XHR', 'Fonts', 'Other'];
const resourceTypeColors: { [key: string]: string } = {
    html: 'hsl(var(--primary))',
    css: 'hsl(140, 70%, 45%)',
    js: 'hsl(50, 80%, 55%)',
    img: 'hsl(var(--primary))',
    image: 'hsl(var(--primary))',
    font: 'hsl(300, 70%, 50%)',
    xhr: 'hsl(210, 80%, 60%)',
    other: 'hsl(var(--muted-foreground))',
    default: 'hsl(var(--muted-foreground))'
}

function WaterfallTabContent({ data }: {data: AnalysisResult}) {
    const { waterfall } = data;
    const [filter, setFilter] = useState('');
    const [activeType, setActiveType] = useState('All');

    if (!waterfall) {
        return <Card><CardContent><p className='p-4'>Waterfall data not available for this URL.</p></CardContent></Card>
    }

    const filteredData = waterfall.filter(item => {
        const typeL = activeType.toLowerCase();
        let typeMatch = true;
        
        if (typeL !== 'all') {
            const itemType = (item.type || 'other').toLowerCase();
            if (typeL === 'images') {
                typeMatch = ['img', 'image'].includes(itemType);
            } else if (typeL === 'js') {
                typeMatch = itemType === 'js' || itemType === 'script';
            }
             else if (resourceTypes.slice(1).map(t => t.toLowerCase()).includes(typeL)) {
                typeMatch = itemType === typeL;
            } else {
                 typeMatch = false;
            }
        }
        
        const filterMatch = item.url.toLowerCase().includes(filter.toLowerCase());
        return typeMatch && filterMatch;
    });
    
    const maxTime = Math.max(...waterfall.map(i => i.start + i.time), 1000);

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
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className='w-full'>
                                                        <div className="w-full h-6 bg-muted rounded-sm overflow-hidden relative">
                                                            <div 
                                                                className="h-full absolute"
                                                                style={{ 
                                                                    left: `${(item.start / maxTime) * 100}%`, 
                                                                    width: `${(item.time / maxTime) * 100}%`,
                                                                    backgroundColor: resourceTypeColors[item.type as keyof typeof resourceTypeColors] || resourceTypeColors.default
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{item.time}ms</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                           </Table>
                        </div>
                    </div>
                     <div className="flex justify-between items-center p-2 text-sm font-medium border-t bg-muted/50">
                        <p>{waterfall.length} Requests</p>
                        {/* <p>24.5MB (25.1MB Uncompressed)</p>
                        <p>Fully Loaded 4.4s (Onload 1.1s)</p> */}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}

function SummaryTabContent({ data }: { data: AnalysisResult }) {
    return (
        <div className="space-y-6">
            <SpeedVisualization data={data}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TopIssues data={data} />
                </div>
                <div className="space-y-6">
                    <PageDetails data={data} />
                    <ServerDetails data={data} />
                </div>
            </div>
        </div>
    );
}

function SpeedVisualization({data}: {data: AnalysisResult}) {
    if (!data.browserTimings) return null;

    const getTime = (name: string) => {
        const timing = data.browserTimings.find(t => t.name === name);
        return timing ? parseFloat(timing.value) : 0;
    }

    const ttfb = getTime('Time to First Byte (TTFB)');
    const onload = getTime('Onload Time');
    const fcp = getTime('First Contentful Paint');
    const lcp = getTime('Largest Contentful Paint');
    const tti = getTime('Time to Interactive');
    const fullyLoaded = getTime('Fully Loaded Time');
    
    const maxTime = Math.max(ttfb, onload, fcp, lcp, tti, fullyLoaded, 1000);

    const events = [
        { name: 'First Contentful Paint', time: fcp, color: 'bg-blue-500' },
        { name: 'Largest Contentful Paint', time: lcp, color: 'bg-green-500' },
        { name: 'Time to Interactive', time: tti, color: 'bg-purple-500' },
        { name: 'Fully Loaded Time', time: fullyLoaded, color: 'bg-red-500' },
    ].sort((a,b) => a.time - b.time);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Speed Visualization</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative h-24 w-full rounded-lg bg-muted">
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
                        {[...Array(8)].map((_, i) => (
                            <span key={i}>{((maxTime / 8) * (i + 1) / 1000).toFixed(1)}s</span>
                        ))}
                    </div>

                    <div className="absolute inset-x-0 top-8 h-12 flex items-center">
                        <div className="w-full h-full flex">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex-1 border-r border-dashed border-border last:border-r-0"></div>
                            ))}
                        </div>
                    </div>
                     <div className="absolute inset-x-0 top-8 h-12 flex items-center">
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute h-12 bg-gray-200 dark:bg-gray-700 rounded-md" style={{ left: '1%', width: `${(ttfb/maxTime)*100}%` }}></div>
                                </TooltipTrigger>
                                <TooltipContent>TTFB: {ttfb}ms</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute h-12 bg-gray-300 dark:bg-gray-600 rounded-md" style={{ left: `${(ttfb/maxTime)*100}%`, width: `${((onload-ttfb)/maxTime)*100}%`}}></div>
                                </TooltipTrigger>
                                 <TooltipContent>Onload: {onload}ms</TooltipContent>
                            </Tooltip>

                            {events.map(event => (
                                <Tooltip key={event.name}>
                                    <TooltipTrigger asChild>
                                         <div className={cn("absolute top-1/2 -translate-y-1/2 w-0.5 h-10", event.color)} style={{ left: `${(event.time/maxTime)*100}%` }}></div>
                                    </TooltipTrigger>
                                    <TooltipContent>{event.name}: {event.time}ms</TooltipContent>
                                </Tooltip>
                            ))}
                         </TooltipProvider>
                     </div>
                </div>
                 <div className="mt-2 space-y-1">
                    {events.map(event => (
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

function TopIssues({ data }: { data: AnalysisResult }) {
    const { topIssues } = data;

    if (!topIssues || topIssues.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Top Issues</CardTitle>
                    <CardDescription>No major performance issues were identified. Well done!</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const getSeverityStyle = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
            case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
            case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800/50';
        }
    }
    
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
                    {topIssues.map((issue, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className={cn("my-2 border rounded-lg", getSeverityStyle(issue.severity))}>
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
                                        <p className="mb-4 prose prose-sm dark:prose-invert max-w-none">{issue.content.description}</p>
                                        {issue.content.urls && issue.content.urls.length > 0 && (
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
                                                                <TableCell className="font-medium truncate max-w-xs"><a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.url}</a></TableCell>
                                                                <TableCell className="text-right">{item.size}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
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

function PageDetails({data}: {data: AnalysisResult}) {
    const { pageDetails } = data;
    if (!pageDetails) return null;

    const sizeData = pageDetails.totalPageSizeBreakdown;
    const totalSize = sizeData.reduce((acc, curr) => acc + curr.value, 0);

    const requestData = pageDetails.totalPageRequestsBreakdown;
    
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
                            <h4 className="font-semibold">{pageDetails.fullyLoadedTime}</h4>
                            <p className="text-sm text-muted-foreground">Fully Loaded Time</p>
                        </div>
                        <Progress value={100} />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Total Page Size - {pageDetails.totalPageSize}</h4>
                        <div className="flex w-full h-8 rounded-md overflow-hidden">
                            {sizeData.map(item => (
                                <TooltipProvider key={item.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={cn("flex items-center justify-center text-white text-xs font-bold", item.color)} style={{ width: `${(item.value / totalSize) * 100}%` }}>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {item.name} {item.value.toFixed(2)}MB
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Total Page Requests - {pageDetails.totalPageRequests}</h4>
                        <div className="flex w-full h-8 rounded-md overflow-hidden">
                             {requestData.map(item => (
                                 <TooltipProvider key={item.name}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={cn("flex items-center justify-center text-white text-xs font-bold", item.color)} style={{ width: `${item.value}%` }}>
                                            </div>
                                        </TooltipTrigger>
                                         <TooltipContent>
                                            {item.name} {item.value}%
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Look into reducing JavaScript, reducing web-fonts, and image optimization to ensure a lightweight and streamlined website.</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ServerDetails({data}: {data: AnalysisResult}) {
    const { serverDetails } = data;
    if (!serverDetails) return null;
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
                    <span className="font-mono text-sm">{serverDetails.ipAddress}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Fingerprint className="h-4 w-4 text-muted-foreground" />
                        <span>Nameservers</span>
                    </div>
                    <div className="text-right">
                        {serverDetails.nameservers.map(ns => <span key={ns} className="font-mono text-sm block">{ns}</span>)}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span>Powered By</span>
                    </div>
                    <span className="font-mono text-sm">{serverDetails.poweredBy}</span>
                </div>
            </CardContent>
        </Card>
    )
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
                 <SummaryTabContent data={data} />
              </TabsContent>
              <TabsContent value="performance" className="pt-6">
                 <PerformanceTabContent data={data} />
              </TabsContent>
              <TabsContent value="structure" className="pt-6">
                <Card>
                    <CardHeader><CardTitle>Structure</CardTitle></CardHeader>
                    <CardContent><p className='p-4'>Structure analysis data is not available for this URL.</p></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="waterfall" className="pt-6">
                <WaterfallTabContent data={data} />
              </TabsContent>
              <TabsContent value="optimization" className="pt-6">
                <UnusedCodeAnalysis unusedCode={data.unusedCode} />
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
        <DashboardLayout>
            <Suspense fallback={<ResultsLoading />}>
                <ResultsPageContent />
            </Suspense>
        </DashboardLayout>
    )
}
