
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Users, FileText, Calendar, Bell, Settings, LogOut, 
  Menu, X, ChevronRight, BarChart3
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", path: "/dashboard", icon: Home },
  { title: "Clients", path: "/clients", icon: Users },
  { title: "Contracts", path: "/contracts", icon: FileText },
  { title: "Schedule", path: "/schedule", icon: Calendar },
  { title: "Reports", path: "/reports", icon: BarChart3 },
  { title: "Notifications", path: "/notifications", icon: Bell },
  { title: "Settings", path: "/settings", icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if the current path is active
  const isActivePath = (path: string) => {
    return location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(path));
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded-sm bg-primary" />
          <span className="text-lg">PestPro</span>
        </div>
      </div>
      <ScrollArea className="flex-1 pb-4">
        <nav className="grid gap-1 px-2 py-4">
          {sidebarItems.map((item) => (
            <Button
              key={item.path}
              variant={isActivePath(item.path) ? "secondary" : "ghost"}
              className={cn(
                "flex h-10 justify-start gap-3",
                isActivePath(item.path) && "bg-accent"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {isActivePath(item.path) && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  // If not mounted yet, don't render anything to avoid hydration issues
  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden w-64 border-r bg-background lg:block">
        {renderSidebarContent()}
      </div>
      
      {/* Mobile sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 h-14 flex items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="lg:hidden flex items-center gap-2 font-semibold">
            <span>PestPro</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1">
          <div className="container mx-auto p-4 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
