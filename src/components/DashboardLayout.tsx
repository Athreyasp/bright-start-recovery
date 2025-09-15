import { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Bell, Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
                
                {/* Enhanced Search Bar */}
                <div className="relative w-80 hidden lg:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search recovery resources, appointments..." 
                    className="pl-12 pr-4 py-3 bg-muted/30 border-0 focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
          <main className="flex-1 overflow-auto bg-dashboard">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}