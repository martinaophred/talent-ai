import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recruiter from "./pages/Recruiter";
import Candidate from "./pages/Candidate";
import RoleDetail from "./pages/RoleDetail";
import CandidateDetail from "./pages/CandidateDetail";
import Challenges from "./pages/Challenges";
import Admin from "./pages/Admin";
import { ensurePersona } from "@/lib/persona";

const queryClient = new QueryClient();

function RequirePersona({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const persona = ensurePersona();
  if (!persona) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/recruiter"
            element={
              <RequirePersona>
                <Recruiter />
              </RequirePersona>
            }
          />
          {/* Alias for plural path */}
          <Route
            path="/recruiters"
            element={
              <RequirePersona>
                <Recruiter />
              </RequirePersona>
            }
          />
          <Route
            path="/candidate"
            element={
              <RequirePersona>
                <Candidate />
              </RequirePersona>
            }
          />
          {/* Alias for plural path */}
          <Route
            path="/candidates"
            element={
              <RequirePersona>
                <Candidate />
              </RequirePersona>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="/roles/:id"
            element={
              <RequirePersona>
                <RoleDetail />
              </RequirePersona>
            }
          />
          <Route
            path="/candidates/:id"
            element={
              <RequirePersona>
                <CandidateDetail />
              </RequirePersona>
            }
          />
          <Route
            path="/challenges"
            element={
              <RequirePersona>
                <Challenges />
              </RequirePersona>
            }
          />
          <Route
            path="/admin"
            element={
              <RequirePersona>
                <Admin />
              </RequirePersona>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
