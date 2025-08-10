import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recruiter from "./pages/Recruiter";
import Candidate from "./pages/Candidate";
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
          <Route
            path="/candidate"
            element={
              <RequirePersona>
                <Candidate />
              </RequirePersona>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
