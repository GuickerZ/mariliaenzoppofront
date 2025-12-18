import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { TimeTrackingProvider } from "@/contexts/TimeTrackingContext"; // Corrigido
import Login from "./pages/Login";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TimeTrackingProvider>  {/* Agora o TimeTrackingProvider está fora do BrowserRouter */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/communities/:id" element={<CommunityDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TimeTrackingProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
