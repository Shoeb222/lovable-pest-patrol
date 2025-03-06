
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, CheckCircle, Clock, Filter, Plus, Search, UserPlus 
} from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  types: string[];
  dueDate: Date;
  amount: number;
  status: "pending" | "dueToday" | "completed";
  frequency: string;
}

// Sample data - would normally come from an API
const sampleContracts: Contract[] = [
  {
    id: "C001",
    clientId: "1",
    clientName: "John Smith",
    types: ["Termite", "Rodent"],
    dueDate: new Date(2023, 5, 15),
    amount: 250,
    status: "completed",
    frequency: "90 Days",
  },
  {
    id: "C002",
    clientId: "2",
    clientName: "Sarah Johnson",
    types: ["Cockroach"],
    dueDate: new Date(),
    amount: 150,
    status: "dueToday",
    frequency: "30 Days",
  },
  {
    id: "C003",
    clientId: "3",
    clientName: "Michael Brown",
    types: ["Mosquito", "Ant"],
    dueDate: new Date(2023, 6, 20),
    amount: 300,
    status: "pending",
    frequency: "60 Days",
  },
  {
    id: "C004",
    clientId: "4",
    clientName: "Emily Davis",
    types: ["Bed Bug"],
    dueDate: new Date(2023, 5, 10),
    amount: 200,
    status: "completed",
    frequency: "One-Time",
  },
  {
    id: "C005",
    clientId: "1",
    clientName: "John Smith",
    types: ["Termite"],
    dueDate: new Date(2023, 7, 5),
    amount: 180,
    status: "pending",
    frequency: "180 Days",
  },
];

export function ContractList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [contracts, setContracts] = useState(sampleContracts);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter contracts based on search query and active tab
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.types.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && contract.status === "pending";
    if (activeTab === "dueToday") return matchesSearch && contract.status === "dueToday";
    if (activeTab === "completed") return matchesSearch && contract.status === "completed";
    
    return matchesSearch;
  });

  const getStatusIcon = (status: Contract["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "dueToday":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
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

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>
              Manage all your pest control service contracts
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Filter
            </CustomButton>
            <CustomButton
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate("/clients/new")}
            >
              New Contract
            </CustomButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="dueToday">Due Today</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Services</TableHead>
                <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id} className="hover-lift cursor-pointer" onClick={() => navigate(`/contracts/${contract.id}`)}>
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>{contract.clientName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {contract.types.map((type, index) => (
                          <Badge key={index} variant="outline" className="bg-secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(contract.dueDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${contract.amount}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "flex items-center gap-1 font-normal",
                          getStatusClass(contract.status)
                        )}
                      >
                        {getStatusIcon(contract.status)}
                        <span>{getStatusText(contract.status)}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No contracts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
