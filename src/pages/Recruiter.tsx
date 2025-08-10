import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { postMatch, MatchRequestSchema, MatchResponse } from "@/lib/api";

const Chip: React.FC<{ text: string }> = ({ text }) => (
  <Badge variant="secondary">{text}</Badge>
);

const Row: React.FC<{ c: MatchResponse["candidates"][number]; blind: boolean }> = ({ c, blind }) => {
  const obId = useMemo(() => `C${String(c.candidate_id).slice(-3)}`, [c.candidate_id]);
  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4 text-sm">{blind ? obId : c.candidate_id}</td>
      <td className="py-3 pr-4 text-sm font-medium">{Math.round(c.score * 100)}%</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{c.explanation}</td>
      <td className="py-3 pr-4">
        <div className="flex flex-wrap gap-2">{c.skills.map((s) => <Chip key={s} text={s} />)}</div>
      </td>
      <td className="py-3 pr-4 text-sm">{c.major_field_of_studies.join(", ")}</td>
      <td className="py-3 pr-4 text-sm">{c.professional_company_names.join(", ")}</td>
    </tr>
  );
};

const Recruiter = () => {
  const [title, setTitle] = useState("Machine Learning Engineer");
  const [description, setDescription] = useState("We are looking for a Machine Learning Engineer with experience in Python, TensorFlow, and deep learning.");
  const [skills, setSkills] = useState("Python, TensorFlow, Machine Learning, Deep Learning");
  const [topK, setTopK] = useState(10);
  const [majors, setMajors] = useState("Computer Science");
  const [blind, setBlind] = useState(localStorage.getItem("talentai_blind") === "1");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<MatchResponse | null>(null);

  useEffect(() => {
    localStorage.setItem("talentai_blind", blind ? "1" : "0");
  }, [blind]);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = MatchRequestSchema.parse({
        title,
        description,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        top_k: topK,
        filters: { major_field_of_studies: majors.split(",").map(s => s.trim()).filter(Boolean) },
      });
      const r = await postMatch(payload);
      setResp(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4 p-5 rounded-xl border bg-card shadow-sm">
          <h2 className="text-lg font-semibold">Match Job</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={e=>setDescription(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" value={skills} onChange={e=>setSkills(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topk">Top K</Label>
              <Input id="topk" type="number" min={1} max={20} value={topK} onChange={e=>setTopK(parseInt(e.target.value||"10",10))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="majors">Major Field(s)</Label>
              <Input id="majors" value={majors} onChange={e=>setMajors(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch id="blind" checked={blind} onCheckedChange={setBlind} />
              <Label htmlFor="blind">Blind Mode</Label>
            </div>
            <Button onClick={submit} disabled={loading}>{loading ? "Matching..." : "Run Match"}</Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="p-5 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Results</h2>
              {resp && (
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify({
                    title,
                    description,
                    skills: skills.split(",").map(s=>s.trim()).filter(Boolean),
                    top_k: topK,
                    filters: { major_field_of_studies: majors.split(",").map(s=>s.trim()).filter(Boolean) },
                  }, null, 2))}
                >Copy JSON</Button>
              )}
            </div>
            {!resp ? (
              <p className="text-sm text-muted-foreground pt-2">Paste or type a role and click Match to see ranked candidates.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left mt-4">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr className="border-b">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Explanation</th>
                      <th className="py-2 pr-4">Skills</th>
                      <th className="py-2 pr-4">Majors</th>
                      <th className="py-2 pr-4">Companies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resp.candidates.map((c) => (
                      <Row key={c.candidate_id} c={c} blind={blind} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Recruiter;
