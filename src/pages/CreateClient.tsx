
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";

// Import client type
import { Client } from "@/components/clients/ClientList";

const CreateClient = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
    pinCode: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.name || !formData.mobile || !formData.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Create a unique ID for the new client
    const newClientId = `client-${Date.now()}`;
    
    // Create the new client object
    const newClient: Client = {
      id: newClientId,
      name: formData.name,
      company: formData.companyName || null,
      email: formData.email,
      phone: formData.mobile,
      gender: formData.gender || "Not specified",
      activeContracts: 0
    };
    
    // Simulate API call to save the client
    setTimeout(() => {
      // In a real app, this would save to the database
      // For now, we'll add it to the sampleClients array in ClientList
      import("@/components/clients/ClientList").then(({ sampleClients }) => {
        sampleClients.push(newClient);
        
        toast({
          title: "Client created",
          description: `${formData.name} has been added to your clients.`,
        });
        
        // Navigate to contract creation with client data
        navigate(`/contracts/new?clientId=${newClientId}&newClient=true`);
        setIsSubmitting(false);
      });
    }, 1000);
  };

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
            <CustomButton
              variant="outline"
              onClick={() => navigate("/clients")}
            >
              Cancel
            </CustomButton>
          </div>
          <p className="text-muted-foreground">
            Create a new client to manage their pest control services.
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>
              Enter the client's personal and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="ABC Corporation"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    placeholder="123-456-7890"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN Code</Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      placeholder="12345"
                      value={formData.pinCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/clients")}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Continue to Contract
                </CustomButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateClient;
