'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { analyzeUrl } from '@/app/actions';
import Image from 'next/image';

const formSchema = z.object({
  url: z.string().min(1, { message: "Please enter a URL." }),
});

export default function SmartInspectPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Validate URL client-side before sending to server action
            let urlToAnalyze = values.url;
            if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
                urlToAnalyze = `https://${urlToAnalyze}`;
            }
            // Basic check for a valid-looking URL structure
            new URL(urlToAnalyze);

            // The actual analysis is now done on the results page.
            // We just navigate to it with the URL.
            router.push(`/dashboard/results?url=${encodeURIComponent(values.url)}`);

        } catch (error: any) {
            let errorMessage = "Please enter a valid URL (e.g., example.com).";
             if (error instanceof TypeError) {
                 // This catches invalid URL format errors from `new URL()`
                 toast({
                    variant: "destructive",
                    title: "Invalid URL",
                    description: errorMessage,
                });
             } else {
                toast({
                    variant: "destructive",
                    title: "Analysis Failed",
                    description: error.message || "Something went wrong.",
                });
             }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="max-w-2xl w-full">
                 <div className="mb-4 flex justify-center">
                    <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f52d/512.webp" alt="Telescope" width={80} height={80} />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Website Performance Analysis
                </h1>
                <p className="text-muted-foreground mb-8">
                    Enter a URL to analyze your website's performance and get optimization insights.
                </p>

                <Card>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-2">
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem className="w-full text-left">
                                            <FormControl>
                                                <Input placeholder="example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
