
import { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the User type
interface User {
  id: string;
  email: string;
  name: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: true, // Always authenticated for now
  isLoading: false,
  login: async () => {},
  logout: () => {},
  resetPassword: async () => {},
});

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Create a default user for the application
  const defaultUser: User = {
    id: "1",
    email: "demo@example.com",
    name: "Demo User"
  };
  
  const [user, setUser] = useState<User | null>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Login function (not used for now but kept for future implementation)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login is bypassed now
      toast({
        title: "Login successful",
        description: "Welcome to PestPro!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function (not really used for now but kept for future implementation)
  const logout = () => {
    // We don't actually log out now
    toast({
      title: "Logout functionality",
      description: "Logout is currently disabled as authentication is bypassed.",
    });
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Password reset functionality",
        description: "Password reset is currently disabled as authentication is bypassed.",
      });
    } catch (error) {
      toast({
        title: "Failed to send reset email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Always consider as authenticated
  const isAuthenticated = true;

  // Value provided to consumers of the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
