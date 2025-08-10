import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { postMatch, MatchRequestSchema, MatchResponse, checkApiHealth } from "@/lib/api";

const Chip: React.FC<{ text: string }> = ({ text }) => (
  <Badge variant="secondary">{text}</Badge>
);

const Row: React.FC<{ c: MatchResponse["candidates"][number]; blind: boolean }> = ({ c, blind }) => {
  const obId = useMemo(() => `C${String(c.candidate_id).slice(-3)}`, [c.candidate_id]);
  
  // Parse skills from string to array
  const skillsArray = useMemo(() => {
    if (!c.skills) return [];
    // Handle both comma-separated and array-like string formats
    if (c.skills.startsWith('[') && c.skills.endsWith(']')) {
      try {
        const parsed = JSON.parse(c.skills);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Fallback to comma separation
        return c.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return c.skills.split(',').map(s => s.trim()).filter(Boolean);
  }, [c.skills]);

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 pr-4 text-sm font-mono">{blind ? obId : c.candidate_id}</td>
      <td className="py-3 pr-4 text-sm font-medium">
        <span className={`px-2 py-1 rounded-full text-xs ${
          c.score >= 0.8 ? 'bg-green-100 text-green-800' :
          c.score >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {Math.round(c.score * 100)}%
        </span>
      </td>
      <td className="py-3 pr-4 text-sm text-muted-foreground max-w-xs truncate" title={c.explanation}>
        {c.explanation}
      </td>
      <td className="py-3 pr-4 text-sm max-w-xs truncate" title={c.career_objective}>
        {c.career_objective || <span className="text-muted-foreground">No objective listed</span>}
      </td>
      <td className="py-3 pr-4">
        <div className="flex flex-wrap gap-1">
          {skillsArray.length > 0 ? (
            skillsArray.slice(0, 3).map((s) => <Chip key={s} text={s} />)
          ) : (
            <span className="text-muted-foreground text-sm">No skills listed</span>
          )}
          {skillsArray.length > 3 && (
            <span className="text-xs text-muted-foreground">+{skillsArray.length - 3} more</span>
          )}
        </div>
      </td>
      <td className="py-3 pr-4 text-sm">
        {c.major_field_of_studies.length > 0 
          ? c.major_field_of_studies.join(", ") 
          : <span className="text-muted-foreground">Not specified</span>
        }
      </td>
      <td className="py-3 pr-4 text-sm">
        {c.professional_company_names.length > 0 
          ? c.professional_company_names.join(", ") 
          : <span className="text-muted-foreground">No experience listed</span>
        }
      </td>
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
  const [error, setError] = useState<string | null>(null);
  const [resp, setResp] = useState<MatchResponse | null>(null);
  const [apiHealth, setApiHealth] = useState<boolean | null>(null);

  useEffect(() => {
    localStorage.setItem("talentai_blind", blind ? "1" : "0");
  }, [blind]);

  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiHealth(isHealthy);
    };
    checkHealth();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = MatchRequestSchema.parse({
        title,
        description,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        top_k: topK,
        filters: majors.trim() ? { major_field_of_studies: majors.split(",").map(s => s.trim()).filter(Boolean) } : undefined,
      });
      const r = await postMatch(payload);
      setResp(r);
    } catch (err) {
      console.error('Error during match:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while matching candidates');
      setResp(null);
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
              <Input id="majors" value={majors} onChange={e=>setMajors(e.target.value)} placeholder="Optional filter" />
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
                    filters: majors.trim() ? { major_field_of_studies: majors.split(",").map(s=>s.trim()).filter(Boolean) } : undefined,
                  }, null, 2))}
                >Copy JSON</Button>
              )}
            </div>
            
            {apiHealth === null && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 text-sm">🔄 Checking API connection...</p>
              </div>
            )}
            
            {apiHealth === true && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm">✅ API server is connected and ready</p>
              </div>
            )}
            
            {apiHealth === false && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">
                  ⚠️ API server is not available. Please ensure the Flask API is running on localhost:5000
                </p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            {!resp && !error ? (
              <p className="text-sm text-muted-foreground pt-2">Paste or type a role and click Match to see ranked candidates.</p>
            ) : resp ? (
              <div className="overflow-x-auto">
                <div className="mt-4 mb-2 text-sm text-muted-foreground">
                  Found {resp.candidates_found} candidates for "{resp.job_title}"
                </div>
                <table className="w-full text-left">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr className="border-b">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Explanation</th>
                      <th className="py-2 pr-4">Career Objective</th>
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
            ) : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Recruiter;
