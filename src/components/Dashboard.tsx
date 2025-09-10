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
    if (!user) return;
    
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
      description: "AI-powered wellness check",
      icon: Calculator,
      color: "text-success",
      bgColor: "bg-success/10",
      href: "/dashboard/risk-calculator",
      riskScore: riskScore
    },
    {
      title: "AI Support Chat",
      description: "24/7 instant support",
      icon: Bot,
      color: "text-accent",
      bgColor: "bg-accent/10",
      href: "/dashboard/chatbot"
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
      title: "Therapy Sessions",
      description: "Connect with specialists",
      icon: Brain,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      href: "/dashboard/appointments?type=psychologist"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {profile?.full_name || 'friend'}! 
        </h1>
        <p className="text-muted-foreground">
          Track your progress and stay connected with your recovery journey
        </p>
      </div>

      {/* Daily Check-in Reminder */}
      {!todayCheckIn && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Daily Check-in</h3>
                  <p className="text-muted-foreground text-sm">How are you feeling today?</p>
                </div>
              </div>
              <Link to="/dashboard/daily-checkin">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Check-in
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-primary">{streakDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-success">{weeklyCheckIns}/7</p>
              </div>
            </div>
            <Progress value={(weeklyCheckIns / 7) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold text-accent">{totalCheckIns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  
                  {action.riskScore !== null && action.riskScore !== undefined && (
                    <div className={`p-2 rounded-lg border ${getRiskBgColor(action.riskScore)} text-center`}>
                      <span className="text-xs font-medium">Current Risk: </span>
                      <span className={`text-sm font-bold ${getRiskColor(action.riskScore)}`}>
                        {action.riskScore}%
                      </span>
                    </div>
                  )}
                  
                  {action.priority && !todayCheckIn && (
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-xs text-primary font-medium">Pending today</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Healthcare & Support */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Healthcare & Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthcareTools.map((tool) => (
            <Link key={tool.title} to={tool.href}>
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                  </div>
                  
                  {tool.title === "Book Appointment" && upcomingAppointments.length > 0 && (
                    <div className="mt-3 p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Next: {new Date(upcomingAppointments[0].appointment_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Profile & Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Profile & Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileTools.map((tool) => (
            <Link key={tool.title} to={tool.href}>
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center`}>
                      <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;