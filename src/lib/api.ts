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
    skills: string;
    educational_institution_name: string[];
    degree_names: string[];
    passing_years: string[];
    major_field_of_studies: string[];
    professional_company_names: string[];
  }>;
};

// API base URL - adjust this to match your Flask API endpoint
const API_BASE_URL = 'http://localhost:5000';

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function postMatch(req: MatchRequest): Promise<MatchResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: req.title,
        description: req.description,
        skills: req.skills,
        top_k: req.top_k,
        filters: req.filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'API returned an error');
    }

    // Transform the API response to match our expected format
    return {
      status: data.status,
      job_title: data.job_title,
      candidates_found: data.candidates_found,
              candidates: data.candidates.map((candidate: {
          candidate_id: number;
          score: number;
          explanation: string;
          career_objective?: string;
          skills?: string;
          educational_institution_name?: string[] | string;
          degree_names?: string[] | string;
          passing_years?: string[] | string;
          major_field_of_studies?: string[] | string;
          professional_company_names?: string[] | string;
        }) => ({
        candidate_id: candidate.candidate_id,
        score: candidate.score,
        explanation: candidate.explanation,
        career_objective: candidate.career_objective || '',
        skills: candidate.skills || '',
        educational_institution_name: Array.isArray(candidate.educational_institution_name) 
          ? candidate.educational_institution_name 
          : [],
        degree_names: Array.isArray(candidate.degree_names) 
          ? candidate.degree_names 
          : [],
        passing_years: Array.isArray(candidate.passing_years) 
          ? candidate.passing_years 
          : [],
        major_field_of_studies: Array.isArray(candidate.major_field_of_studies) 
          ? candidate.major_field_of_studies 
          : [],
        professional_company_names: Array.isArray(candidate.professional_company_names) 
          ? candidate.professional_company_names 
          : [],
      })),
    };
  } catch (error) {
    console.error('Error calling match API:', error);
    throw error;
  }
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

export async function postResume(req: ResumeRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'API returned an error');
    }

    return data;
  } catch (error) {
    console.error('Error calling resume API:', error);
    throw error;
  }
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
