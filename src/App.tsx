import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import ProviderCategories from "./pages/ProviderCategories";
import CategoryDetail from "./pages/CategoryDetail";
import NewTicket from "./pages/NewTicket";
import TicketDetail from "./pages/TicketDetail";
import TicketList from "./pages/TicketList";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:providerId" element={<ProviderCategories />} />
          <Route path="/catalog/:providerId/:categoryId" element={<CategoryDetail />} />
          <Route path="/catalog/:providerId/:categoryId/new" element={<NewTicket />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
