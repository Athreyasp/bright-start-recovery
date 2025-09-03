import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calculator, FileText, Calendar, Brain, Bot, User, Activity, Heart, Users, Stethoscope, MessageCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch latest risk assessment
      const { data: riskData } = await supabase
        .from('risk_assessments')
        .select('score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (riskData) {
        setRiskScore(riskData.score);
      }

      // Check if user has done today's check-in
      const today = new Date().toISOString().split('T')[0];
      const { data: checkInData } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      setTodayCheckIn(checkInData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-success";
    if (score <= 70) return "text-warning";
    return "text-destructive";
  };

  const getRiskBgColor = (score: number) => {
    if (score <= 30) return "bg-success/10 border-success/20";
    if (score <= 70) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  const modules = [
    {
      title: "Risk Calculator",
      description: "AI-powered relapse risk assessment",
      icon: Calculator,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/dashboard/risk-calculator",
      special: true,
      riskScore: riskScore
    },
    {
      title: "Consent Forms",
      description: "Digital forms for family & friends",
      icon: FileText,
      color: "text-soft-green",
      bgColor: "bg-soft-green/10",
      href: "/dashboard/consent-forms"
    },
    {
      title: "Doctor Appointments",
      description: "Schedule & manage medical visits",
      icon: Calendar,
      color: "text-calm-blue",
      bgColor: "bg-calm-blue/10",
      href: "/dashboard/appointments"
    },
    {
      title: "Psychologist",
      description: "Licensed therapy sessions",
      icon: Brain,
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/dashboard/appointments?type=psychologist"
    },
    {
      title: "Psychiatrist",
      description: "Medication & specialized care",
      icon: Stethoscope,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
      href: "/dashboard/appointments?type=psychiatrist"
    },
    {
      title: "AI Chatbot",
      description: "24/7 support & motivation",
      icon: Bot,
      color: "text-warning",
      bgColor: "bg-warning/10",
      href: "/dashboard/chatbot"
    },
    {
      title: "User Portfolio",
      description: "Recovery timeline & achievements",
      icon: User,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      href: "/dashboard/profile"
    },
    {
      title: "Symptom Detector",
      description: "Daily mood & symptom tracking",
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/dashboard/daily-checkin"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-primary">QuitBuddy</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {!todayCheckIn && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">1</Badge>
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Welcome, {profile?.full_name || user?.email?.split('@')[0]}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {profile?.full_name || 'friend'}</h1>
          <p className="text-muted-foreground">Here's your recovery dashboard. You're doing great - keep it up!</p>
        </div>

        {/* Alert for daily check-in */}
        {!todayCheckIn && (
          <Card className="mb-8 border-warning/50 bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Don't forget your daily check-in!</h3>
                    <p className="text-sm text-muted-foreground">How are you feeling today? Track your mood and progress.</p>
                  </div>
                </div>
                <Link to="/dashboard/daily-checkin">
                  <Button>Complete Check-in</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link key={module.title} to={module.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${module.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <module.icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{module.description}</p>
                  
                  {module.special && module.riskScore !== null && (
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-3 rounded-lg border ${getRiskBgColor(module.riskScore)}`}>
                        <span className="text-sm font-medium">Current Risk Score</span>
                        <span className={`text-2xl font-bold ${getRiskColor(module.riskScore)}`}>
                          {module.riskScore}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              module.riskScore <= 30 ? 'bg-success' : 
                              module.riskScore <= 70 ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${module.riskScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {module.riskScore <= 30 ? 'Low Risk' : module.riskScore <= 70 ? 'Moderate' : 'High Risk'}
                        </span>
                      </div>
                    </div>
                  )}

                  {module.special && module.riskScore === null && (
                    <div className="text-center p-4 border-2 border-dashed border-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">No assessment yet</p>
                      <Button variant="outline" size="sm">Take Assessment</Button>
                    </div>
                  )}
                  
                  {!module.special && (
                    <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto text-primary hover:text-primary/80">
                      Access Now →
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/daily-checkin">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Daily Check-in</h3>
                      <p className="text-sm text-muted-foreground">Log today's mood & activities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/chatbot">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-soft-green/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-soft-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Support</h3>
                      <p className="text-sm text-muted-foreground">Chat with AI assistant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <div className="cursor-pointer" onClick={() => {
              toast({
                title: "Emergency Support",
                description: "If you're in crisis, please call 988 or your local emergency services.",
                variant: "destructive"
              });
            }}>
              <Card className="hover:shadow-md transition-shadow border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-destructive">Emergency Support</h3>
                      <p className="text-sm text-muted-foreground">Get immediate help</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;