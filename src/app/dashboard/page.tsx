'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, File, FileCode, Image as ImageIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const unusedFiles = [
    {
        name: 'unused-styles.css',
        path: '/css/unused-styles.css',
        size: '44.53 KB',
        unused: 98,
        icon: FileCode,
        type: 'css',
    },
    {
        name: 'old-analytics.js',
        path: '/js/old-analytics.js',
        size: '22.85 KB',
        unused: 95,
        lastUsed: '30 days ago',
        icon: Code,
        type: 'js',
    },
    {
        name: 'hero-old.jpg',
        path: '/images/hero-old.jpg',
        size: '152.34 KB',
        unused: 87,
        lastUsed: '15 days ago',
        icon: ImageIcon,
        type: 'img'
    },
    {
        name: 'legacy-grid.css',
        path: '/css/legacy-grid.css',
        size: '12.5 KB',
        unused: 92,
        icon: FileCode,
        type: 'css'
    },
]

type StatCardProps = {
    title: string;
    value: string | number;
    description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-4xl text-red-500">{value}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function AssetOptimizerPage() {
    const cssFiles = unusedFiles.filter(f => f.type === 'css');
    const jsFiles = unusedFiles.filter(f => f.type === 'js');
    const imageFiles = unusedFiles.filter(f => f.type === 'img');

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Asset Optimizer</h1>
                    <p className="text-muted-foreground">Find and remove unused files and code to optimize your site</p>
                </div>
                <Button>
                    Quick Scan
                </Button>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Switch id="deep-scan" />
                    <label htmlFor="deep-scan" className="font-bold">Deep Scan</label>
                </div>
                <Badge variant="outline">Advanced</Badge>
                <p className="text-sm text-muted-foreground">Find completely unused files only</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Unused Files" value={4} description="Total unused files detected" />
                <StatCard title="Wasted Space" value="232.23 KB" description="Total space taken by unused files" />
                <StatCard title="CSS Files" value={2} description="Unused CSS files" />
                <StatCard title="JS Files" value={1} description="Unused JavaScript files" />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Tabs defaultValue="all">
                        <div className="p-4 border-b">
                            <TabsList>
                                <TabsTrigger value="all">All (4)</TabsTrigger>
                                <TabsTrigger value="css">CSS (2)</TabsTrigger>
                                <TabsTrigger value="js">JavaScript (1)</TabsTrigger>
                                <TabsTrigger value="images">Images (1)</TabsTrigger>
                            </TabsList>
                            <div className="float-right">
                                <Tabs defaultValue="files" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="files"><File className="h-4 w-4 mr-2" />Files</TabsTrigger>
                                        <TabsTrigger value="code"><Code className="h-4 w-4 mr-2" />Code Blocks</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>

                        <div className="p-4">
                            <TabsContent value="all">
                                <FileList files={unusedFiles} />
                            </TabsContent>
                             <TabsContent value="css">
                                <FileList files={cssFiles} />
                            </TabsContent>
                             <TabsContent value="js">
                                <FileList files={jsFiles} />
                            </TabsContent>
                            <TabsContent value="images">
                                <FileList files={imageFiles} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

        </div>
    )
}

function FileList({ files }: { files: typeof unusedFiles }) {
    return (
        <ul className="space-y-4">
            {files.map((file) => (
                <li key={file.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-4">
                        <file.icon className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{file.name}</span>
                                <Badge variant="destructive">{file.unused}% unused</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{file.path}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{file.size}</span>
                                {file.lastUsed && <span>Last used: {file.lastUsed}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
