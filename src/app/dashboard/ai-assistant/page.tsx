'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import Image from 'next/image';
import DashboardLayout from "../layout";

export default function AiAssistantPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <Card className="bg-primary/10">
                            <CardContent className="p-4">
                                <p>How do I improve my website's loading speed?</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex items-start gap-4">
                        <Avatar>
                        <AvatarFallback>
                            <Image src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp" alt="Bot" width={24} height={24} />
                        </AvatarFallback>
                        </Avatar>
                        <Card>
                            <CardContent className="p-4">
                                <p>To improve your website's loading speed, you can start by optimizing images, minifying CSS and JavaScript files, and leveraging browser caching. Would you like me to analyze a specific URL for more detailed recommendations?</p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Ask the AI assistant..." />
                        <Button>Send</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
