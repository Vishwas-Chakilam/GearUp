
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import useScrollToTop from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import Reviews from "./pages/Reviews";
import Guides from "./pages/Guides";
import News from "./pages/News";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Developer from "./pages/Developer";
import "./App.css";

// Layout component that handles scroll restoration
const Layout = () => {
  useScrollToTop();
  return <Outlet />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <ThemeProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/developer" element={<Developer />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </ThemeProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
