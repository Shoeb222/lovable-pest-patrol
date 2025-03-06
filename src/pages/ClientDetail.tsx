
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Phone, Mail, Building, User, MapPin, Calendar, Edit } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";

// Import types and sample data
import { Client } from "@/components/clients/ClientList";
import { Contract } from "@/components/contracts/ContractList";

const ClientDetail = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch client data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Simulating API call
    setTimeout(() => {
      // This would be replaced with real API calls
      Promise.all([
        import("@/components/clients/ClientList").then(({ sampleClients }) => {
          const foundClient = sampleClients.find(c => c.id === clientId);
          if (foundClient) {
            setClient(foundClient);
          } else {
            toast({
              title: "Client not found",
              description: `No client found with ID ${clientId}`,
              variant: "destructive",
            });
            navigate("/clients");
          }
        }),
        import("@/components/contracts/ContractList").then(({ sampleContracts }) => {
          const clientContracts = sampleContracts.filter(c => c.clientId === clientId);
          setContracts(clientContracts);
        })
      ]).then(() => {
        setLoading(false);
      });
    }, 500);
  }, [clientId, isAuthenticated, navigate, toast]);

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

  // If client not found, this will show briefly before redirect
  if (!client) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p>Client not found. Redirecting...</p>
        </div>
      </AppLayout>
    );
  }

  // Split contracts into upcoming, past
  const upcomingContracts = contracts.filter(c => c.status === "pending" || c.status === "dueToday");
  const pastContracts = contracts.filter(c => c.status === "completed");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Client Profile</h1>
            <CustomButton
              variant="outline"
              onClick={() => navigate("/clients")}
            >
              Back to Clients
            </CustomButton>
          </div>
          <p className="text-muted-foreground">
            View and manage client details and contract history.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-3 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Client Information</span>
                <CustomButton
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/clients/edit/${client.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </CustomButton>
              </CardTitle>
              <CardDescription>
                Personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{client.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{client.company || "Individual Client"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{"123 Main St, City, State, 12345" /* This would come from the client data */}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Client Since</h3>
                <p className="font-medium">{"January 15, 2023" /* This would come from the client data */}</p>
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-2">
                <CustomButton
                  onClick={() => navigate(`/contracts/new?clientId=${client.id}`)}
                >
                  Create New Contract
                </CustomButton>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-4 animate-fade-in">
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>
                Manage client's service contracts and history
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="upcoming">
                <div className="px-6 pt-2">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="upcoming">Upcoming ({upcomingContracts.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({pastContracts.length})</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="upcoming" className="mt-0 pt-4">
                  {upcomingContracts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contract ID</TableHead>
                          <TableHead>Services</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingContracts.map((contract) => (
                          <TableRow 
                            key={contract.id} 
                            className="hover-lift cursor-pointer"
                            onClick={() => navigate(`/contracts/${contract.id}`)}
                          >
                            <TableCell className="font-medium">{contract.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {contract.types.map((type, index) => (
                                  <Badge key={index} variant="outline" className="bg-secondary">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(contract.dueDate, "MMM dd, yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>
                              {contract.status === "dueToday" ? (
                                <Badge variant="destructive">Due Today</Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 px-4">
                      <p className="text-muted-foreground">No upcoming contracts.</p>
                      <CustomButton
                        className="mt-4"
                        onClick={() => navigate(`/contracts/new?clientId=${client.id}`)}
                      >
                        Create New Contract
                      </CustomButton>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="mt-0 pt-4">
                  {pastContracts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contract ID</TableHead>
                          <TableHead>Services</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastContracts.map((contract) => (
                          <TableRow 
                            key={contract.id} 
                            className="hover-lift cursor-pointer"
                            onClick={() => navigate(`/contracts/${contract.id}`)}
                          >
                            <TableCell className="font-medium">{contract.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {contract.types.map((type, index) => (
                                  <Badge key={index} variant="outline" className="bg-secondary">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(contract.dueDate, "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell>${contract.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No past contracts.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientDetail;
