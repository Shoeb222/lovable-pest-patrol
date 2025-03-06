
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Search, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  gender: string;
  activeContracts: number;
}

// Sample data - would normally come from an API
export const sampleClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    company: "ABC Corporation",
    email: "john@example.com",
    phone: "123-456-7890",
    gender: "Male",
    activeContracts: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: null,
    email: "sarah@example.com",
    phone: "234-567-8901",
    gender: "Female",
    activeContracts: 1,
  },
  {
    id: "3",
    name: "Michael Brown",
    company: "XYZ Ltd",
    email: "michael@example.com",
    phone: "345-678-9012",
    gender: "Male",
    activeContracts: 0,
  },
  {
    id: "4",
    name: "Emily Davis",
    company: null,
    email: "emily@example.com",
    phone: "456-789-0123",
    gender: "Female",
    activeContracts: 3,
  },
  {
    id: "5",
    name: "Robert Wilson",
    company: "Wilson Enterprises",
    email: "robert@example.com",
    phone: "567-890-1234",
    gender: "Male",
    activeContracts: 1,
  },
];

export function ClientList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(sampleClients);

  // Filter clients based on search query
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <CustomButton
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => navigate("/clients/new")}
        >
          Add New Client
        </CustomButton>
      </div>
      
      <div className="rounded-md border animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Company</TableHead>
              <TableHead className="text-center">Contracts</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="hover-lift">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{client.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell">{client.company || "-"}</TableCell>
                  <TableCell className="text-center">
                    {client.activeContracts > 0 ? (
                      <Badge variant="secondary" className="ml-auto">
                        {client.activeContracts}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CustomButton
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </CustomButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
