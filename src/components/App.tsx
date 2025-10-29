import { Toaster } from "./Toaster/Toaster";
import { Toaster as Sonner } from "./sonner";
import { TooltipProvider } from "./tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseGenerator from "../pages/CourseGenerator/CourseGenerator";
import CourseView from "../pages/CourseView/CourseView";
import NotFound from "../pages/NotFound/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CourseGenerator />} />
          <Route path="/course" element={<CourseView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
