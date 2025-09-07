'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, File, FileCode, Image as ImageIcon, Trash2, Copy, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import PageLayout from "../page-layout";


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

const unusedCodeBlocks = [
    {
        id: 'legacy-modal',
        title: '.legacy-modal',
        file: 'joss/main.css',
        lines: '245-267',
        percentage: 96,
        savings: '1.21 KB',
        description: 'Selector never used in any HTML or JavaScript',
        code: `
.legacy-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.legacy-modal__header {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.legacy-modal__content {
  line-height: 1.6;
}

.legacy-modal__footer {
  margin-top: 1.5rem;
  text-align: right;
}
        `.trim(),
        status: 'safe'
    },
    {
        id: 'formatLegacyDate',
        title: 'formatLegacyDate',
        file: 'js/utils.js',
        lines: '89-103',
        percentage: 98,
        savings: '580 Bytes',
        description: 'Function never called, replaced by modern Intl API',
        code: `
function formatLegacyDate(date) {
  // Legacy date formatter - replaced by Intl.DateTimeFormat
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  return \`\${months[d.getMonth()]} \${d.getDate()}, \${d.getFullYear()}\`;
}
        `.trim(),
        status: 'safe'
    },
    {
        id: 'deprecated-constants',
        title: 'DEPRECATED_CONSTANTS',
        file: 'js/constants.js',
        lines: '42-49',
        percentage: 94,
        savings: '286 Bytes',
        description: 'These constants are no longer in use.',
        code: `
export const OLD_API_ENDPOINT = '/api/v1/data';
export const MAX_RETRIES = 3;
        `.trim(),
        status: 'safe'
    }
];

type StatCardProps = {
    title: string;
    value: string | number;
    description?: string;
    Icon?: React.ElementType;
}

function StatCard({ title, value, description, Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}

function AssetOptimizerPage() {
    const cssFiles = unusedFiles.filter(f => f.type === 'css');
    const jsFiles = unusedFiles.filter(f => f.type === 'js');
    const imageFiles = unusedFiles.filter(f => f.type === 'img');

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Asset Optimizer</h1>
                    <p className="text-muted-foreground">Find and remove unused files and code to optimize your site</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button>
                        Export Report
                    </Button>
                     <Button variant="destructive">
                        Remove All Safe (3)
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Switch id="deep-scan" />
                    <label htmlFor="deep-scan" className="font-bold">Deep Scan</label>
                </div>
                <Badge variant="outline">Advanced</Badge>
                <p className="text-sm text-muted-foreground">Analyze code within files for unused functions, variables, and CSS rules</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Unused Code Blocks" value={4} />
                <StatCard title="Potential Savings" value="2.9 KB" />
                <StatCard title="CSS Rules" value={2} />
                <StatCard title="JS Functions" value={2} />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Tabs defaultValue="code">
                        <div className="p-4 border-b flex justify-between items-center">
                            <TabsList>
                                <TabsTrigger value="files"><File className="h-4 w-4 mr-2" />Files</TabsTrigger>
                                <TabsTrigger value="code"><Code className="h-4 w-4 mr-2" />Code Blocks</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-4">
                            <TabsContent value="files">
                                <Tabs defaultValue="all">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="all">All ({unusedFiles.length})</TabsTrigger>
                                        <TabsTrigger value="css">CSS ({cssFiles.length})</TabsTrigger>
                                        <TabsTrigger value="js">JavaScript ({jsFiles.length})</TabsTrigger>
                                        <TabsTrigger value="images">Images ({imageFiles.length})</TabsTrigger>
                                    </TabsList>
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
                                </Tabs>
                            </TabsContent>
                            <TabsContent value="code">
                                <CodeBlockList />
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

function CodeBlockList() {
    return (
         <Accordion type="multiple" className="space-y-4" defaultValue={['legacy-modal']}>
            {unusedCodeBlocks.map((block) => (
                <AccordionItem value={block.id} key={block.id} className="border-none">
                     <Card className="border-t-4 border-red-500">
                        <CardHeader>
                            <AccordionTrigger className="p-0 hover:no-underline">
                                 <div className="flex justify-between items-center w-full">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg font-bold">{block.title}</CardTitle>
                                            <Badge variant="destructive">{block.percentage}% unused</Badge>
                                            <span className="text-sm text-green-500">{block.savings} savings</span>
                                        </div>
                                         <p className="text-sm text-muted-foreground text-left mt-1">{block.file} - Lines {block.lines}</p>
                                         <p className="text-sm text-muted-foreground text-left">{block.description}</p>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">View File</Button>
                                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            </AccordionTrigger>
                        </CardHeader>
                        <AccordionContent>
                             <div className="bg-muted dark:bg-zinc-800 rounded-lg overflow-hidden">
                                <div className="px-4 py-2 flex justify-between items-center bg-zinc-200 dark:bg-zinc-900">
                                    <p className="text-xs font-semibold">Code to be removed:</p>
                                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(block.code)}>
                                        <Copy className="h-3 w-3 mr-2" />
                                        Copy
                                    </Button>
                                </div>
                                <pre className="p-4 text-xs overflow-x-auto">
                                    <code>{block.code}</code>
                                </pre>
                            </div>
                            <div className={cn("mt-4 flex items-center gap-2 text-sm", block.status === 'safe' ? 'text-green-600' : 'text-yellow-600')}>
                                {block.status === 'safe' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <span>
                                    {block.status === 'safe' ? `Safe to remove - No dependencies found - ${block.savings} reduction` : 'Potential issues found'}
                                </span>
                            </div>
                        </AccordionContent>
                     </Card>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export default function Page() {
    return (
        <PageLayout>
            <AssetOptimizerPage />
        </PageLayout>
    )
}
