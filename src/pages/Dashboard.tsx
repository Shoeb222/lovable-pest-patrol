
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ContractChart } from "@/components/dashboard/ContractChart";
import { CustomButton } from "@/components/ui/custom-button";
import { CalendarDays, FileText, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show welcome toast on first load
  useEffect(() => {
    if (user) {
      toast({
        title: `Welcome back, ${user.name}!`,
        description: "Here's your pest control service dashboard.",
      });
    }
  }, [user, toast]);

  // If not authenticated yet (checking), show nothing or a loading state
  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Get an overview of your pest control services and business performance.
          </p>
        </div>

        <div className="space-y-6">
          <DashboardMetrics />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ContractChart />

            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
              <div className="grid gap-3">
                <CustomButton
                  className="justify-start h-14"
                  leftIcon={<Users className="h-5 w-5" />}
                  onClick={() => navigate("/clients/new")}
                >
                  <div className="flex flex-col items-start">
                    <span>New Client</span>
                    <span className="text-xs text-primary-foreground/80">Add a new client to the system</span>
                  </div>
                </CustomButton>
                
                <CustomButton
                  className="justify-start h-14"
                  leftIcon={<FileText className="h-5 w-5" />}
                  onClick={() => navigate("/contracts/new")}
                  variant="outline"
                >
                  <div className="flex flex-col items-start">
                    <span>New Contract</span>
                    <span className="text-xs text-muted-foreground">Create a new service agreement</span>
                  </div>
                </CustomButton>
                
                <CustomButton
                  className="justify-start h-14"
                  leftIcon={<CalendarDays className="h-5 w-5" />}
                  onClick={() => navigate("/schedule")}
                  variant="outline"
                >
                  <div className="flex flex-col items-start">
                    <span>View Schedule</span>
                    <span className="text-xs text-muted-foreground">See upcoming appointments</span>
                  </div>
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
