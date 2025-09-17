import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, FileText, Calendar, Brain, Bot, User, Activity, Heart, TrendingUp, Clock, CheckCircle, Target, Award, Trophy, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState<number>(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [totalCheckIns, setTotalCheckIns] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) {
      console.log('No user found, skipping dashboard data fetch');
      return;
    }
    
    console.log('Fetching dashboard data for user:', user.id);
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [
        riskResult, 
        checkInResult, 
        weeklyCheckInsResult, 
        appointmentsResult,
        totalCheckInsResult,
        streakResult
      ] = await Promise.all([
        // Fetch latest risk assessment
        supabase
          .from('risk_assessments')
          .select('score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        
        // Check if user has done today's check-in
        supabase
          .from('daily_check_ins')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle(),

        // Get weekly check-ins count
        supabase
          .from('daily_check_ins')
          .select('date')
          .eq('user_id', user.id)
          .gte('date', weekAgo),

        // Get upcoming appointments
        supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true })
          .limit(3),

        // Get total check-ins
        supabase
          .from('daily_check_ins')
          .select('date')
          .eq('user_id', user.id),

        // Calculate streak (consecutive check-ins)
        supabase
          .from('daily_check_ins')
          .select('date')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30)
      ]);

      if (riskResult.data) {
        setRiskScore(riskResult.data.score);
      }

      setTodayCheckIn(checkInResult.data);
      setWeeklyCheckIns(weeklyCheckInsResult.data?.length || 0);
      setUpcomingAppointments(appointmentsResult.data || []);
      setTotalCheckIns(totalCheckInsResult.data?.length || 0);

      // Calculate streak
      if (streakResult.data && streakResult.data.length > 0) {
        let streak = 0;
        const dates = streakResult.data.map(item => item.date).sort().reverse();
        const todayDate = new Date();
        
        for (let i = 0; i < dates.length; i++) {
          const checkDate = new Date(dates[i]);
          const expectedDate = new Date(todayDate);
          expectedDate.setDate(todayDate.getDate() - i);
          
          if (checkDate.toDateString() === expectedDate.toDateString()) {
            streak++;
          } else {
            break;
          }
        }
        setStreakDays(streak);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive"
      });
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

  const quickActions = [
    {
      title: "Daily Check-in",
      description: "Track your daily progress",
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/dashboard/daily-checkin",
      priority: true
    },
    {
      title: "Risk Assessment",
      description: "Personalized wellness evaluation",
      icon: Calculator,
      color: "text-success",
      bgColor: "bg-success/10",
      href: "/dashboard/risk-calculator",
      riskScore: riskScore
    },
    {
      title: "Stress Calculator",
      description: "Assess and manage stress levels",
      icon: BarChart3,
      color: "text-warning",
      bgColor: "bg-warning/10",
      href: "/dashboard/stress-calculator"
    },
    {
      title: "Psychology Professionals",
      description: "Find qualified specialists",
      icon: Brain,
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/dashboard/psychology-professionals"
    }
  ];

  const healthcareTools = [
    {
      title: "Book Appointment",
      description: "Schedule medical visits",
      icon: Calendar,
      color: "text-calm-blue",
      bgColor: "bg-calm-blue/10",
      href: "/dashboard/appointments"
    },
    {
      title: "Psychology Professionals",
      description: "Browse qualified therapists",
      icon: Brain,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      href: "/dashboard/psychology-professionals"
    }
  ];

  const profileTools = [
    {
      title: "My Profile",
      description: "View your recovery journey",
      icon: User,
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      href: "/dashboard/profile"
    },
    {
      title: "Consent Forms",
      description: "Family support settings",
      icon: FileText,
      color: "text-soft-green",
      bgColor: "bg-soft-green/10",
      href: "/dashboard/consent-forms"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-8">
        {/* Enhanced Welcome Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl" />
          <div className="relative text-center py-8 px-6">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl floating-animation">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  Welcome back, {profile?.full_name || 'friend'}!
                </h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your recovery journey continues today. Track your progress and stay connected with support.
            </p>
          </div>
        </div>

        {/* Enhanced Daily Check-in Reminder */}
        {!todayCheckIn && (
          <Card className="dashboard-card border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl pulse-ring">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">Daily Check-in</h3>
                    <p className="text-muted-foreground">How are you feeling today? Let's track your progress.</p>
                  </div>
                </div>
                <Link to="/dashboard/daily-checkin">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl scale-on-hover">
                    Start Check-in
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-primary mb-2">{streakDays}</p>
                <p className="text-xs text-muted-foreground">consecutive days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  {Math.round((weeklyCheckIns / 7) * 100)}%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <p className="text-3xl font-bold text-success mb-2">{weeklyCheckIns}<span className="text-lg text-muted-foreground">/7</span></p>
                <Progress value={(weeklyCheckIns / 7) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  Total
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Check-ins Completed</p>
                <p className="text-3xl font-bold text-accent mb-2">{totalCheckIns}</p>
                <p className="text-xs text-muted-foreground">lifetime total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Essential Tools
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <Card className={`dashboard-card group cursor-pointer h-full ${
                  action.priority && !todayCheckIn ? 'ring-2 ring-primary/50 animate-pulse' : ''
                }`}>
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${action.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className={`w-7 h-7 ${action.color}`} />
                      </div>
                      {action.priority && !todayCheckIn && (
                        <Badge className="bg-primary text-white shadow-lg">
                          Priority
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {action.description}
                      </p>
                      
                      {action.riskScore !== null && action.riskScore !== undefined && (
                        <div className={`p-4 rounded-xl border ${getRiskBgColor(action.riskScore)} space-y-3`}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">Risk Level</span>
                            <Badge 
                              variant={action.riskScore <= 30 ? "secondary" : action.riskScore <= 70 ? "outline" : "destructive"}
                              className="text-xs font-medium"
                            >
                              {action.riskScore <= 30 ? "Low" : action.riskScore <= 70 ? "Moderate" : "High"}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <span className={`text-2xl font-bold ${getRiskColor(action.riskScore)}`}>
                              {action.riskScore}%
                            </span>
                          </div>
                          <Progress value={action.riskScore} className="h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Healthcare & Support */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Healthcare & Support</h2>
            <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
              Professional Care
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthcareTools.map((tool, index) => (
              <Link key={tool.title} to={tool.href}>
                <Card className="dashboard-card group cursor-pointer h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className={`w-7 h-7 ${tool.color}`} />
                      </div>
                      {upcomingAppointments.length > 0 && tool.title === "Book Appointment" && (
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          {upcomingAppointments.length} Upcoming
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {tool.description}
                      </p>
                      
                      {tool.title === "Book Appointment" && upcomingAppointments.length > 0 && (
                        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                          <p className="text-sm font-medium mb-1">Next Appointment</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(upcomingAppointments[0].appointment_date).toLocaleDateString()} at {upcomingAppointments[0].appointment_time}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Profile & Settings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Profile & Settings</h2>
            <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">
              Personal
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileTools.map((tool, index) => (
              <Link key={tool.title} to={tool.href}>
                <Card className="dashboard-card group cursor-pointer h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className={`w-7 h-7 ${tool.color}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;