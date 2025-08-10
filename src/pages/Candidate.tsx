import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { postResume } from "@/lib/api";
import { useState } from "react";

const Candidate = () => {
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    setUploading(true);
    try {
      await postResume({
        career_objective: "Experienced data scientist with expertise in machine learning and statistical analysis.",
        skills: ["Python","Machine Learning","Statistical Analysis","SQL"],
        educational_institution_name: ["Stanford University"],
        degree_names: ["Master of Science in Statistics"],
        passing_years: ["2020"],
        educational_results: ["3.8 GPA"],
        result_types: ["GPA"],
        major_field_of_studies: ["Statistics"],
        professional_company_names: ["Google","Microsoft"],
      });
      alert("Resume added successfully (mock)");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="p-5 rounded-xl border bg-card shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="text-sm text-muted-foreground">Completeness</div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary" />
          </div>
          <div className="flex gap-2 pt-2">
            <Badge>LLMOps</Badge>
            <Badge variant="secondary">Data</Badge>
            <Badge variant="outline">NLP</Badge>
          </div>
          <Button onClick={upload} disabled={uploading}>{uploading ? "Uploading..." : "Upload CV"}</Button>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border bg-card shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Top Matches</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {["ML Engineer @ Acme","Data Scientist @ Globex"].map((t,i)=>(
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t}</div>
                  <Badge className="">{75 + i * 8}% Fit</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {["Python","TensorFlow","SQL"].map(s=> <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold">Challenges</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {["LLMOps Eval Harness","NLP Prompt Guard"].map((c,i)=>(
              <div key={i} className="p-4 rounded-lg border">
                <div className="font-medium">{c}</div>
                <div className="text-sm text-muted-foreground">ETA {30 + i*15} mins</div>
                <Button variant="outline" className="mt-3">Start</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Candidate;
