import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Login } from "@/components/login";
import { AdminDashboard } from "@/components/admin-dashboard";
import { UserTerminal } from "@/components/user-terminal";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (user.role === "admin") {
    return <AdminDashboard onLogout={logout} />;
  }

  if (user.role === "user") {
    return <UserTerminal onLogout={logout} />;
  }

  return <NotFound />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
