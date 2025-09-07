'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from 'next/image';

const analysisSteps = [
    "Kicking off the analysis engines...",
    "Fetching website data...",
    "Running Lighthouse performance tests...",
    "Analyzing page structure...",
    "Detecting unused code...",
    "Compiling your report...",
];

export default function ResultsLoading() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prevStep) => (prevStep + 1) % analysisSteps.length);
        }, 2000); // Change step every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center text-center p-8">
                <div>
                    <div className="flex justify-center mb-4">
                        <Image src="https://i.imgur.com/xFKPxya.gif" alt="Analyzing" width={64} height={64} className="animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold">Analyzing your page...</h1>
                    <p className="text-muted-foreground min-h-[20px]">{analysisSteps[currentStep]}</p>
                </div>
            </div>

            <div>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-6 w-3/4" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                             <Skeleton className="h-4 w-2/3" />
                             <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-10 w-1/3 mb-2" />
                             <Skeleton className="h-3 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                         <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
