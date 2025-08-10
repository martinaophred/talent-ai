import { z } from "zod";

export const MatchRequestSchema = z.object({
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  top_k: z.number().default(10),
  filters: z.object({ major_field_of_studies: z.array(z.string()).optional() }).optional(),
});

export type MatchRequest = z.infer<typeof MatchRequestSchema>;

export type MatchResponse = {
  status: "success";
  job_title: string;
  candidates_found: number;
  candidates: Array<{
    candidate_id: number;
    score: number;
    explanation: string;
    career_objective: string;
    skills: string[];
    educational_institution_name: string[];
    degree_names: string[];
    passing_years: string[];
    major_field_of_studies: string[];
    professional_company_names: string[];
  }>;
};

// Deterministic mock generator
function hash(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export async function postMatch(req: MatchRequest): Promise<MatchResponse> {
  const seed = hash(req.title + req.description + req.skills.join(","));
  const rng = mulberry32(seed);
  const k = Math.max(1, Math.min(req.top_k ?? 10, 10));

  const skills = req.skills.length ? req.skills : ["Python", "Machine Learning", "SQL"];
  const candidates = Array.from({ length: Math.floor(rng() * k) + Math.max(3, Math.floor(k/2)) }).map((_, i) => {
    const id = Math.floor(rng() * 900) + 100;
    const skillOverlap = skills.slice(0, Math.max(1, Math.floor(rng() * skills.length)));
    const score = Math.round((0.6 + rng() * 0.4) * 100) / 100;
    return {
      candidate_id: id,
      score,
      explanation: `Semantic match, skill overlap: ${skillOverlap.length}`,
      career_objective: "Experienced ML engineer...",
      skills: Array.from(new Set([...skillOverlap, "TensorFlow", "NLP"])) .slice(0, 4),
      educational_institution_name: [rng() > 0.5 ? "MIT" : "Stanford"],
      degree_names: ["Master of Science"],
      passing_years: [String(2018 + Math.floor(rng() * 6))],
      major_field_of_studies: req.filters?.major_field_of_studies ?? ["Computer Science"],
      professional_company_names: [rng() > 0.5 ? "Google" : "Microsoft"],
    };
  }).sort((a,b) => b.score - a.score).slice(0, k);

  return {
    status: "success",
    job_title: req.title,
    candidates_found: candidates.length,
    candidates,
  };
}

export type ResumeRequest = {
  career_objective: string;
  skills: string[];
  educational_institution_name: string[];
  degree_names: string[];
  passing_years: string[];
  educational_results?: string[];
  result_types?: string[];
  major_field_of_studies: string[];
  professional_company_names: string[];
};

export async function postResume(_: ResumeRequest) {
  return {
    status: "success",
    message: "Resume added successfully",
    resume_id: 1001,
    total_resumes: 1001,
  };
}

export async function getMe() {
  return { role: (localStorage.getItem("talentai_user") && JSON.parse(localStorage.getItem("talentai_user")!).role) || "candidate" };
}

function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
