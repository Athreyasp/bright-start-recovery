import { ReactNode, useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import ChatBot from "@/components/ChatBot"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchableItems = [
    { title: "Daily Check-in", url: "/dashboard/daily-checkin", description: "Track your daily progress and mood" },
    { title: "Risk Calculator", url: "/dashboard/risk-calculator", description: "Assess your relapse risk" },
    { title: "Stress Calculator", url: "/dashboard/stress-calculator", description: "Evaluate and manage stress levels" },
    { title: "Appointments", url: "/dashboard/appointments", description: "Schedule and manage healthcare appointments" },
    { title: "Psychology Professionals", url: "/dashboard/psychology-professionals", description: "Find qualified therapists and counselors" },
    { title: "Consent Forms", url: "/dashboard/consent-forms", description: "Manage family support settings" },
    { title: "User Profile", url: "/dashboard/profile", description: "View and edit your profile information" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = searchableItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchItemClick = (url: string) => {
    navigate(url);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <header className="h-18 border-b border-border/30 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between px-6 h-full">
              <div className="flex items-center space-x-6">
                <SidebarTrigger>
                  <Button variant="ghost" size="sm" className="hover:bg-muted/80 transition-all duration-200 rounded-xl p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SidebarTrigger>
                
                {/* Enhanced Search Bar with Results */}
                <div className="relative w-80 hidden lg:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search recovery resources, appointments..." 
                    className="pl-12 pr-10 py-3 bg-muted/30 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl transition-all duration-200"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                      onClick={clearSearch}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((item, index) => (
                            <div
                              key={index}
                              className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                              onClick={() => handleSearchItemClick(item.url)}
                            >
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* User Welcome */}
                <div className="hidden md:block">
                  <p className="text-sm font-medium">
                    Welcome back, <span className="text-primary font-semibold">
                      {profile?.full_name || "User"}
                    </span>
                  </p>
                </div>
                
                {/* Enhanced Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-muted/80 transition-all duration-200 rounded-xl p-3">
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 text-xs bg-primary text-white shadow-lg animate-pulse">
                    2
                  </Badge>
                </Button>
                
                {/* Enhanced Recovery Status */}
                <Badge variant="secondary" className="bg-success/15 text-success border-success/30 px-3 py-1.5 rounded-xl font-medium shadow-sm">
                  <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                  Recovery Active
                </Badge>
              </div>
            </div>
          </header>
          
          {/* Enhanced Main Content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/10">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
          <ChatBot />
        </div>
      </div>
    </SidebarProvider>
  )
}