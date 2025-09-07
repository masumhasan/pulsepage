import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DashboardLayout from "../layout";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This page is under construction.</p>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
