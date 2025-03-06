
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { ContractList } from "@/components/contracts/ContractList";

const Contracts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated yet (checking), show nothing or a loading state
  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage your pest control service agreements and schedules.
          </p>
        </div>

        <ContractList />
      </div>
    </AppLayout>
  );
};

export default Contracts;
