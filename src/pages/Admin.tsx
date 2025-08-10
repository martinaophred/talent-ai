import AppShell from "@/components/AppShell";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

const Admin = () => {
  useEffect(() => {
    document.title = "Admin • TalentAI";
  }, []);

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Stat label="precision@5" value="0.72" />
            <Stat label="Avg TTFM" value="12s" />
            <Stat label="Blind Mode usage" value="64%" />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Snapshot of demo metrics. Hook up to real telemetry later.
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
};

export default Admin;
