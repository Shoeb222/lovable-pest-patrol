
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Calendar, User, Building, DollarSign } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";

// Import the contract type and sample data
import { Contract } from "@/components/contracts/ContractList";

const ContractDetail = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const { toast } = useToast();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch contract data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Simulating API call
    setTimeout(() => {
      // This would be replaced with a real API call
      import("@/components/contracts/ContractList").then(({ sampleContracts }) => {
        const foundContract = sampleContracts.find(c => c.id === contractId);
        if (foundContract) {
          setContract(foundContract);
        } else {
          toast({
            title: "Contract not found",
            description: `No contract found with ID ${contractId}`,
            variant: "destructive",
          });
          navigate("/contracts");
        }
        setLoading(false);
      });
    }, 500);
  }, [contractId, isAuthenticated, navigate, toast]);

  // If not authenticated yet (checking), show nothing or a loading state
  if (!isAuthenticated) return null;

  // Show loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </AppLayout>
    );
  }

  // If contract not found, this will show briefly before redirect
  if (!contract) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p>Contract not found. Redirecting...</p>
        </div>
      </AppLayout>
    );
  }

  const getStatusIcon = (status: Contract["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "dueToday":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getStatusText = (status: Contract["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "dueToday":
        return "Due Today";
      case "completed":
        return "Completed";
    }
  };

  const getStatusClass = (status: Contract["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "dueToday":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const markAsComplete = () => {
    toast({
      title: "Contract marked as complete",
      description: `Contract ${contract.id} has been marked as completed.`,
    });
    
    // In a real app, this would update the database
    setContract({
      ...contract,
      status: "completed"
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Contract Details</h1>
            <CustomButton
              variant="outline"
              onClick={() => navigate("/contracts")}
            >
              Back to Contracts
            </CustomButton>
          </div>
          <p className="text-muted-foreground">
            View and manage the contract for pest control services.
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl">{contract.id}</CardTitle>
              <CardDescription>
                Contract for {contract.clientName}
              </CardDescription>
            </div>
            <Badge 
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium ${getStatusClass(contract.status)}`}
            >
              {getStatusIcon(contract.status)}
              <span>{getStatusText(contract.status)}</span>
            </Badge>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Client Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{contract.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p>{contract.clientCompany || "Individual Client"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contract Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>Due Date: {format(contract.dueDate, "MMMM dd, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p>Amount: ${contract.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p>Frequency: {contract.frequency}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {contract.types.map((type, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    This contract is automatically scheduled based on the AMC frequency. 
                    The next service will be scheduled 7 days before the due date.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end pt-4">
              {contract.status !== "completed" && (
                <CustomButton
                  onClick={markAsComplete}
                  variant="default"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </CustomButton>
              )}
              <CustomButton
                variant="outline"
                onClick={() => navigate(`/clients/${contract.clientId}`)}
              >
                View Client Profile
              </CustomButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ContractDetail;
