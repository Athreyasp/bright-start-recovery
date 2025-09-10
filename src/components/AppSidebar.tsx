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
    return `w-full justify-start transition-all duration-300 rounded-xl p-3 group ${
      active 
        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25 scale-105" 
        : "hover:bg-gradient-to-r hover:from-muted/80 hover:to-muted/40 hover:scale-105 hover:shadow-lg"
    }`
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar className="w-72 transition-all duration-300 border-r border-border/20 bg-background/95 backdrop-blur-xl shadow-2xl">
      <SidebarHeader className="p-6 border-b border-border/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 ring-2 ring-primary/20">
            <Heart className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">QuitBuddy</h2>
            <p className="text-xs text-muted-foreground font-medium">Recovery Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 space-y-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-4 px-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isActive(item.url) 
                            ? "bg-white/20 shadow-lg" 
                            : "bg-transparent group-hover:bg-white/10"
                        }`}>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="font-medium flex-1">{item.title}</span>
                        {isActive(item.url) && (
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Healthcare */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-4 px-2">
            Healthcare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {healthcareItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isActive(item.url) 
                            ? "bg-white/20 shadow-lg" 
                            : "bg-transparent group-hover:bg-white/10"
                        }`}>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="font-medium flex-1">{item.title}</span>
                        {isActive(item.url) && (
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/80 uppercase tracking-wider mb-4 px-2">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isActive(item.url) 
                            ? "bg-white/20 shadow-lg" 
                            : "bg-transparent group-hover:bg-white/10"
                        }`}>
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <span className="font-medium flex-1">{item.title}</span>
                        {isActive(item.url) && (
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/20 bg-gradient-to-t from-muted/20 to-transparent">
        <div className="space-y-4">
          {/* Enhanced User Profile Card */}
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-2xl p-4 space-y-4 border border-border/20 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 ring-2 ring-primary/20 shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground/80 truncate font-medium">
                  Recovery Journey
                </p>
              </div>
            </div>
            
            {/* Enhanced Status Badges */}
            <div className="flex space-x-2">
              <Badge variant="secondary" className="text-xs bg-success/15 text-success border-success/20 hover:bg-success/20 transition-colors">
                <Shield className="w-3 h-3 mr-1" />
                Safe
              </Badge>
              <Badge variant="secondary" className="text-xs bg-accent/15 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
                <Target className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
          
          {/* Enhanced Sign Out Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl p-3 group"
          >
            <LogOut className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}