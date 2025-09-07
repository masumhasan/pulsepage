import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageLayout from "@/app/page-layout";

export default function SettingsPage() {
    return (
        <PageLayout>
            <div className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This page is under construction.</p>
                    </CardContent>
                </Card>
            </div>
        </PageLayout>
    )
}
