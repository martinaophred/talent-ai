import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BrandGradient from "@/components/BrandGradient";
import { setPersona } from "@/lib/persona";

const Index = () => {
  const navigate = useNavigate();

  const choose = (role: "candidate" | "recruiter") => {
    setPersona(role);
    navigate(role === "candidate" ? "/candidate" : "/recruiter");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <BrandGradient />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            TalentAI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Minimalist, fair-by-design matching between AI talent and roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button variant="hero" size="lg" onClick={() => choose("candidate")}>Continue as Candidate</Button>
            <Button variant="outline" size="lg" onClick={() => choose("recruiter")}>Continue as Recruiter</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
