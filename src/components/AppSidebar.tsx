import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Calendar, 
  Brain, 
  Bot, 
  User, 
  Activity, 
  Stethoscope,
  Heart,
  LogOut,
  ChevronRight,
  Shield,
  Target
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Check-in", url: "/dashboard/daily-checkin", icon: Activity },
  { title: "Risk Calculator", url: "/dashboard/risk-calculator", icon: Calculator },
  { title: "AI Chatbot", url: "/dashboard/chatbot", icon: Bot },
]

const healthcareItems = [
  { title: "Appointments", url: "/dashboard/appointments", icon: Calendar },
  { title: "Psychologist", url: "/dashboard/appointments?type=psychologist", icon: Brain },
  { title: "Psychiatrist", url: "/dashboard/appointments?type=psychiatrist", icon: Stethoscope },
]

const toolsItems = [
  { title: "Consent Forms", url: "/dashboard/consent-forms", icon: FileText },
  { title: "User Profile", url: "/dashboard/profile", icon: User },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, profile, signOut } = useAuth()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === path
    }
    return currentPath.startsWith(path)
  }

  const getNavClass = (path: string) => {
    const active = isActive(path)
    return `w-full justify-start transition-all duration-200 ${
      active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "hover:bg-muted/50 hover:translate-x-1"
    }`
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar className="w-72 transition-all duration-300 border-r border-border/40">
      <SidebarHeader className="p-6 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">QuitBuddy</h2>
            <p className="text-xs text-muted-foreground">Recovery Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Healthcare */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Healthcare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {healthcareItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40">
        <div className="space-y-4">
          {/* User Profile Card */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Recovery Journey
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Safe
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Target className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
          
          {/* Sign Out Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}