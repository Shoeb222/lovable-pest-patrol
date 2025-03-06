
import { ArrowRight, ArrowUpRight, CalendarCheck, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    positive: boolean;
  };
  footer?: {
    text: string;
    link?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  footer, 
  className,
  style
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:border-primary/50", className)} style={style}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <div className="rounded-md p-1.5 text-muted-foreground bg-secondary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {value}
          </CardTitle>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-medium">
              <span 
                className={cn(
                  "flex items-center gap-0.5",
                  trend.positive ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}
                <ArrowUpRight className={cn(
                  "h-3 w-3",
                  !trend.positive && "rotate-180"
                )} />
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
      {footer && (
        <CardFooter className="pt-1">
          <button 
            onClick={() => footer.link && window.open(footer.link)}
            className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
          >
            {footer.text}
            <ArrowRight className="h-3 w-3" />
          </button>
        </CardFooter>
      )}
    </Card>
  );
}

export function DashboardMetrics() {
  // This would normally come from an API call
  const metrics = [
    {
      title: "Due Today",
      value: 12,
      trend: { value: "33%", positive: true },
      icon: <CalendarCheck className="h-4 w-4" />,
      footer: { text: "View all", link: "/contracts?status=due" }
    },
    {
      title: "Due This Month",
      value: 48,
      trend: { value: "12%", positive: true },
      icon: <CalendarCheck className="h-4 w-4" />,
      footer: { text: "View all", link: "/contracts?timeframe=month" }
    },
    {
      title: "Total Clients",
      value: 152,
      trend: { value: "3%", positive: true },
      icon: <Users className="h-4 w-4" />,
      footer: { text: "View all", link: "/clients" }
    },
    {
      title: "Active Contracts",
      value: 87,
      trend: { value: "5%", positive: true },
      icon: <CalendarCheck className="h-4 w-4" />,
      footer: { text: "View all", link: "/contracts?status=active" }
    },
    {
      title: "Completed Contracts",
      value: 923,
      description: "All time completed contracts",
      icon: <CalendarCheck className="h-4 w-4" />,
      footer: { text: "View all", link: "/contracts?status=completed" }
    },
    {
      title: "Upcoming Contracts",
      value: 35,
      trend: { value: "2%", positive: false },
      icon: <CalendarCheck className="h-4 w-4" />,
      footer: { text: "View all", link: "/contracts?status=upcoming" }
    },
    {
      title: "Revenue This Month",
      value: "$12,458",
      trend: { value: "8%", positive: true },
      icon: <DollarSign className="h-4 w-4" />,
      footer: { text: "View details", link: "/reports/revenue" }
    },
    {
      title: "Pending Payments",
      value: "$4,320",
      trend: { value: "15%", positive: false },
      icon: <DollarSign className="h-4 w-4" />,
      footer: { text: "View details", link: "/reports/payments" }
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
          trend={metric.trend}
          footer={metric.footer}
          className="animate-scale-in"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}
