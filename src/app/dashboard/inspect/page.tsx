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

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
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
            // Here you would typically call a server action to analyze the URL
            // For now, we'll just simulate a delay and then navigate to a results page
            console.log('Analyzing URL:', values.url);
            await new Promise(resolve => setTimeout(resolve, 2000));
            // In a real app, you would pass the analysis result to the results page
            // For example: router.push(`/dashboard/results?url=${values.url}`);
            toast({
                title: "Analysis Complete",
                description: `Showing results for ${values.url}`,
            });
             router.push(`/dashboard/results?url=${encodeURIComponent(values.url)}`);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: error.message || "Something went wrong.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Website Performance Analysis
                </h1>
                <p className="text-muted-foreground mb-8">
                    Enter a URL to analyze your website's performance and get optimization insights.
                </p>

                <Card>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem className="w-full text-left">
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading}>
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
