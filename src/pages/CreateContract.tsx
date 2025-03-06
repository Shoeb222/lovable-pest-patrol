
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";

// Import client sample data
import { Client } from "@/components/clients/ClientList";

interface ServiceOption {
  id: string;
  name: string;
}

const services: ServiceOption[] = [
  { id: "termite", name: "Termite" },
  { id: "rodent", name: "Rodent" },
  { id: "cockroach", name: "Cockroach" },
  { id: "mosquito", name: "Mosquito" },
  { id: "ant", name: "Ant" },
  { id: "bedbug", name: "Bed Bug" },
  { id: "general", name: "General Pest Control" },
];

const CreateContract = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Parse the query parameters
  const searchParams = new URLSearchParams(location.search);
  const clientIdParam = searchParams.get("clientId");
  const clientNameParam = searchParams.get("clientName");
  const isNewClient = searchParams.get("newClient") === "true";
  
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [showClientSelection, setShowClientSelection] = useState(!clientIdParam && !clientNameParam);
  
  const [formData, setFormData] = useState({
    clientId: clientIdParam || "",
    services: [] as string[],
    frequency: "90", // Default to 90 days
    lastServiceDate: new Date(),
    amount: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clients data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Simulating API call to get clients
    setTimeout(() => {
      import("@/components/clients/ClientList").then(({ sampleClients }) => {
        setClients(sampleClients);
        
        // If client ID or name was provided in URL, set it
        if (clientIdParam) {
          const foundClient = sampleClients.find(c => c.id === clientIdParam);
          if (foundClient) {
            setClient(foundClient);
            setFormData(prev => ({ ...prev, clientId: clientIdParam }));
          }
        } else if (clientNameParam) {
          // Find by name (for demo purposes)
          const foundClient = sampleClients.find(c => 
            c.name.toLowerCase() === clientNameParam.toLowerCase()
          );
          if (foundClient) {
            setClient(foundClient);
            setFormData(prev => ({ ...prev, clientId: foundClient.id }));
          }
        }
        
        setIsLoadingClients(false);
      });
    }, 500);
  }, [isAuthenticated, navigate, clientIdParam, clientNameParam]);

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    setClient(selectedClient || null);
    setFormData(prev => ({ ...prev, clientId }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      
      return { ...prev, services: newServices };
    });
  };

  const handleFrequencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, frequency: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, lastServiceDate: date }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Function to calculate next service date based on frequency
  const calculateNextDate = (date: Date, days: number): Date => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + parseInt(days.toString()));
    return nextDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.clientId) {
      toast({
        title: "Client required",
        description: "Please select a client for this contract.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (formData.services.length === 0) {
      toast({
        title: "Services required",
        description: "Please select at least one service type.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.amount) {
      toast({
        title: "Amount required",
        description: "Please enter the contract amount.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Calculate next service date based on AMC frequency
    const nextServiceDate = calculateNextDate(formData.lastServiceDate, parseInt(formData.frequency));
    
    // Calculate auto-schedule date (7 days before next service)
    const autoScheduleDate = new Date(nextServiceDate);
    autoScheduleDate.setDate(autoScheduleDate.getDate() - 7);
    
    // Create contract object (normally would be saved to database)
    const newContract = {
      id: `contract-${Date.now()}`,
      clientId: formData.clientId,
      clientName: client?.name || "",
      clientCompany: client?.company || undefined,
      types: formData.services,
      dueDate: nextServiceDate,
      autoScheduleDate: autoScheduleDate,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      notes: formData.notes,
      status: "pending" as const,
      lastServiceDate: formData.lastServiceDate
    };
    
    // Simulate creating the contract
    setTimeout(() => {
      // Update client's active contract count
      if (client) {
        const clientToUpdate = clients.find(c => c.id === client.id);
        if (clientToUpdate) {
          clientToUpdate.activeContracts += 1;
        }
      }
      
      // In a real app, this would save to the database
      import("@/components/contracts/ContractList").then(({ sampleContracts }) => {
        // Add the new contract to the sample data
        sampleContracts.push(newContract);
        
        toast({
          title: "Contract created successfully",
          description: `New contract created for ${client?.name}. Next service scheduled for ${format(nextServiceDate, "MMM dd, yyyy")}.`,
        });
        
        // Show the auto-scheduling toast
        setTimeout(() => {
          toast({
            title: "Auto-scheduled next service",
            description: `A follow-up service has been auto-scheduled for 7 days before the due date (${format(autoScheduleDate, "MMM dd, yyyy")}).`,
          });
        }, 1000);
        
        // In a real app, this would redirect to the new contract's detail page
        navigate("/contracts");
        setIsSubmitting(false);
      });
    }, 1500);
  };

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Create New Contract</h1>
            <CustomButton
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </CustomButton>
          </div>
          <p className="text-muted-foreground">
            Set up a new pest control service contract for your client.
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>
              {client ? `Creating a contract for ${client.name}` : "Select a client and configure service details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Selection - Only show if not coming from client creation */}
              {showClientSelection && (
                <div className="space-y-2">
                  <Label htmlFor="client">Client <span className="text-red-500">*</span></Label>
                  {isLoadingClients ? (
                    <div className="h-10 w-full animate-pulse bg-muted rounded-md"></div>
                  ) : (
                    <Select
                      value={formData.clientId}
                      onValueChange={handleClientChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} {client.company ? `(${client.company})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Don't see your client? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/clients/new")}>Add a new client</Button>
                  </p>
                </div>
              )}
              
              {/* Show client info if coming from client creation */}
              {!showClientSelection && client && (
                <div className="bg-muted p-4 rounded-md mb-6">
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  {client.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <p className="text-sm"><span className="font-medium">Email:</span> {client.email}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {client.phone}</p>
                  </div>
                </div>
              )}
              
              <Separator />
              
              {/* Service Types */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Service Types <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select all the pest control services that apply to this contract
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={service.id} 
                        checked={formData.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <Label 
                        htmlFor={service.id}
                        className="font-normal cursor-pointer"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* AMC Frequency */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    AMC Frequency <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select how often pest control services should be provided
                  </p>
                </div>
                
                <RadioGroup 
                  value={formData.frequency}
                  onValueChange={handleFrequencyChange}
                  className="grid gap-4 md:grid-cols-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="freq-30" />
                    <Label htmlFor="freq-30" className="font-normal cursor-pointer">
                      30 Days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60" id="freq-60" />
                    <Label htmlFor="freq-60" className="font-normal cursor-pointer">
                      60 Days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="freq-90" />
                    <Label htmlFor="freq-90" className="font-normal cursor-pointer">
                      90 Days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="180" id="freq-180" />
                    <Label htmlFor="freq-180" className="font-normal cursor-pointer">
                      180 Days
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="365" id="freq-365" />
                    <Label htmlFor="freq-365" className="font-normal cursor-pointer">
                      365 Days
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              {/* Last Service Date */}
              <div className="space-y-2">
                <Label>Last Service Date <span className="text-red-500">*</span></Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.lastServiceDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.lastServiceDate ? (
                          format(formData.lastServiceDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.lastServiceDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Contract Amount <span className="text-red-500">*</span></Label>
                    <Input
                      id="amount"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Any special instructions or notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
              
              {/* Auto-schedule information */}
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Auto-schedule information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Based on your selected frequency of {formData.frequency} days, the next service will be automatically scheduled for {" "}
                        <strong>
                          {format(calculateNextDate(formData.lastServiceDate, parseInt(formData.frequency)), "MMMM dd, yyyy")}
                        </strong>
                      </p>
                      <p className="mt-1">
                        A reminder will be automatically scheduled 7 days before the due date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/contracts")}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Create Contract
                </CustomButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateContract;
