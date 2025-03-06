
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, LockKeyhole, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const { login, resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (isResetMode) {
        if (!formData.email) {
          setError("Please enter your email address");
          setIsSubmitting(false);
          return;
        }
        await resetPassword(formData.email);
        setIsResetMode(false);
      } else {
        if (!formData.email || !formData.password) {
          setError("Please enter both email and password");
          setIsSubmitting(false);
          return;
        }
        await login(formData.email, formData.password);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <div className="text-xl font-bold text-primary-foreground">PP</div>
          </div>
          <h1 className="mt-4 text-3xl font-bold">PestPro</h1>
          <p className="mt-2 text-muted-foreground">Professional Pest Control Management</p>
        </div>
        
        <Card className="border shadow-lg animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {isResetMode ? "Reset your password" : "Sign in to your account"}
            </CardTitle>
            <CardDescription>
              {isResetMode 
                ? "Enter your email address and we'll send you a link to reset your password."
                : "Enter your credentials below to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-scale-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com" 
                    className="pl-10" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {!isResetMode && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password"
                      name="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                    {isResetMode ? "Sending..." : "Signing in..."}
                  </span>
                ) : (
                  isResetMode ? "Send reset instructions" : "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              variant="link" 
              className="px-0" 
              onClick={() => {
                setIsResetMode(!isResetMode);
                setError(null);
              }}
            >
              {isResetMode ? "Back to sign in" : "Forgot your password?"}
            </Button>
            
            <Separator className="my-2" />
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
