import AppShell from "@/components/AppShell";
import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RoleDetail = () => {
  const { id } = useParams();
  const blind = useMemo(() => localStorage.getItem("talentai_blind") === "1", []);

  useEffect(() => {
    document.title = `Role ${id} • TalentAI`;
  }, [id]);

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium">Role</div>
              <div className="text-muted-foreground">{`ML Engineer (${id})`}</div>
            </div>
            <div>
              <div className="font-medium">Must-have skills</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Python", "TensorFlow", "ML"].map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium">Nice-to-have</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["NLP", "Kubernetes", "Airflow"].map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/recruiter">Re-run Match</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ranked Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left mt-2">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">Skills</th>
                    <th className="py-2 pr-4">Majors</th>
                    <th className="py-2 pr-4">Companies</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 pr-4 text-sm">{blind ? `C${100 + i}` : 1000 + i}</td>
                      <td className="py-3 pr-4 text-sm font-medium">{85 - i}%</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-2">
                          {["Python", "ML", "TensorFlow"].slice(0, 2 + (i % 2)).map((s) => (
                            <Badge key={s} variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm">Computer Science</td>
                      <td className="py-3 pr-4 text-sm">{blind ? "—" : "Globex"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
};

export default RoleDetail;
