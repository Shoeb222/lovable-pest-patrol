
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Contracts from "./pages/Contracts";
import ClientDetail from "./pages/ClientDetail";
import ContractDetail from "./pages/ContractDetail";
import CreateClient from "./pages/CreateClient";
import CreateContract from "./pages/CreateContract";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If still loading auth state, show nothing
  if (isLoading) return null;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // If authenticated, render the children
  return <>{children}</>;
};

// Auth routes component (redirect to dashboard if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If still loading auth state, show nothing
  if (isLoading) return null;
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  
  // If not authenticated, render the children
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><CreateClient /></ProtectedRoute>} />
      <Route path="/clients/:clientId" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
      <Route path="/contracts/new" element={<ProtectedRoute><CreateContract /></ProtectedRoute>} />
      <Route path="/contracts/:contractId" element={<ProtectedRoute><ContractDetail /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
