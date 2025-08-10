import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tracks = ["LLMOps", "MLOps", "NLP", "Vision", "Data", "Research"] as const;

const Challenges = () => {
  const [active] = useState<typeof tracks[number]>("LLMOps");

  useEffect(() => {
    document.title = "Challenges • TalentAI";
  }, []);

  return (
    <AppShell>
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {tracks.map((t) => (
            <Badge key={t} variant={t===active?"default":"secondary"}>{t}</Badge>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {["Eval Harness", "Prompt Guard"].map((name, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{active} • {name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">ETA {30 + i * 15} mins</div>
                <Button className="mt-3">Start</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default Challenges;
