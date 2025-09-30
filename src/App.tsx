import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Projects from "./pages/Projects";
import PublicProjects from "./pages/PublicProjects";
import ProjectMap from "./pages/ProjectMap";
import Reports from "./pages/Reports";
import Budgeting2569 from "./pages/Budgeting2569";
import Projects2569 from "./pages/Projects2569";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Notification Bar */}
        <header className="w-full bg-[#00aeff] text-white py-2 px-4 flex items-center justify-between">
          <div className="text-sm font-medium">
            เว็บไซต์นี้เป็นส่วนหนึ่งของ อบจ.ลำพูน
          </div>
          <a
            href="https://lamphunpao.go.th/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline hover:text-blue-200 transition"
          >
            เว็บไซต์หลัก
          </a>
        </header>

        {/* Decorative gradients */}
        <div className="fixed top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="fixed top-60 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply"></div>
        <div className="fixed bottom-0 left-20 w-60 h-60 bg-green-400/10 rounded-full blur-3xl mix-blend-multiply"></div>

        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/projects" element={<Projects />} /> */}
            {/* <Route path="/public-projects" element={<PublicProjects />} /> */}
            {/* <Route path="/map" element={<ProjectMap />} />
            <Route path="/reports" element={<Reports />} /> */}
            <Route path="/budgeting/2569" element={<Budgeting2569 />} />
            <Route path="/projects/2569" element={<Projects2569 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
