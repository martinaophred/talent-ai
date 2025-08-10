import AppShell from "@/components/AppShell";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CandidateDetail = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = `Candidate ${id} • TalentAI`;
  }, [id]);

  const blind = localStorage.getItem("talentai_blind") === "1";

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{blind ? `Candidate C${String(id).slice(-3)}` : `Candidate #${id}`}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {["Python", "TensorFlow", "SQL", "NLP"].map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <div className="text-muted-foreground">
              {blind ? "—" : "Stanford University, M.S. (2020)"}
            </div>
            <Button variant="outline" className="w-full">Invite</Button>
            <Button className="w-full">Request custom challenge</Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {[1,2,3].map((i)=> (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <div className="font-medium">{i===1?"GitHub project":"Challenge attempt"}</div>
                    <div className="text-muted-foreground">{i===1?"LLMOps eval harness":"NLP Prompt Guard"} • credibility {70 + i*5}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication sample</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Clear, concise 150-word explainer about reducing model latency via batching and caching. Rubric score: 8/10.
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
};

export default CandidateDetail;
