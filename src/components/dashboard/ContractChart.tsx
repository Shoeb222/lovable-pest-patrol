
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Sample data - would normally come from an API
const weeklyData = [
  { name: "Mon", contracts: 4 },
  { name: "Tue", contracts: 7 },
  { name: "Wed", contracts: 5 },
  { name: "Thu", contracts: 6 },
  { name: "Fri", contracts: 9 },
  { name: "Sat", contracts: 3 },
  { name: "Sun", contracts: 1 },
];

const monthlyData = [
  { name: "Jan", contracts: 23 },
  { name: "Feb", contracts: 29 },
  { name: "Mar", contracts: 32 },
  { name: "Apr", contracts: 27 },
  { name: "May", contracts: 35 },
  { name: "Jun", contracts: 41 },
  { name: "Jul", contracts: 38 },
  { name: "Aug", contracts: 42 },
  { name: "Sep", contracts: 45 },
  { name: "Oct", contracts: 39 },
  { name: "Nov", contracts: 36 },
  { name: "Dec", contracts: 30 },
];

const categoryData = [
  { name: "Termite", contracts: 48 },
  { name: "Rodent", contracts: 35 },
  { name: "Cockroach", contracts: 42 },
  { name: "Mosquito", contracts: 38 },
  { name: "Bed Bug", contracts: 29 },
  { name: "Ant", contracts: 24 },
  { name: "Other", contracts: 18 },
];

export function ContractChart() {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <Card className="col-span-full animate-scale-in">
      <CardHeader>
        <CardTitle>Contract Analysis</CardTitle>
        <CardDescription>Overview of contract activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
            </TabsList>
          </div>
          <div className="h-[300px] w-full">
            <TabsContent value="weekly" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorContracts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="contracts" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorContracts)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="monthly" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="contracts" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorMonthly)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="category" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--popover))", 
                      borderColor: "hsl(var(--border))",
                      color: "hsl(var(--foreground))"
                    }} 
                  />
                  <Bar 
                    dataKey="contracts" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
