import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Search, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getPersona, clearDemoData, switchPersona } from "@/lib/persona";

const AppShell = ({ children }: PropsWithChildren) => {
  const persona = getPersona();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu />
            </Button>
            <Link to={persona === "recruiter" ? "/recruiter" : "/candidate"} className="font-semibold tracking-tight">
              TalentAI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                className="h-9 w-64 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Search candidates, roles..."
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              onClick={() => {
                const next = switchPersona();
                navigate(next === "candidate" ? "/candidate" : "/recruiter");
              }}
            >
              Switch persona
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clearDemoData();
                navigate("/");
              }}
            >
              Reset demo
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
