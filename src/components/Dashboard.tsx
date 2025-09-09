import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bell, Calculator, FileText, Calendar, Brain, Bot, User, Activity, Heart, Users, Stethoscope, MessageCircle, LogOut, TrendingUp, Clock, CheckCircle, Target, Award, Zap, Star, Trophy, ShieldCheck, BarChart3, ArrowRight, Flame, CalendarDays, Shield } from "lucide-react";
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
    <div className="space-y-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-3 floating-animation">
            Welcome back, {profile?.full_name || 'friend'}! 
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Here's your recovery dashboard. You're doing great - keep it up! 🌟
          </p>
          <div className="flex justify-center space-x-4 mb-6">
            <Badge variant="outline" className="glass-morphism scale-on-hover">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Recovery Strong
            </Badge>
            <Badge variant="outline" className="glass-morphism scale-on-hover">
              <Award className="w-4 h-4 mr-2" />
              {streakDays} Day Streak
            </Badge>
            <Badge variant="outline" className="glass-morphism scale-on-hover">
              <BarChart3 className="w-4 h-4 mr-2" />
              {totalCheckIns} Total Check-ins
            </Badge>
          </div>
        </div>

        {/* Enhanced Daily Check-in Alert */}
        {!todayCheckIn && (
          <Card className="mb-8 dashboard-card border-primary/30 bg-gradient-to-r from-primary/15 to-primary/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center pulse-ring floating-animation shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl flex items-center text-primary mb-2">
                      Ready for your daily check-in? 
                      <Zap className="w-5 h-5 ml-2 text-primary animate-pulse" />
                    </h3>
                    <p className="text-muted-foreground mb-2">Take a moment to reflect on how you're feeling today and track your progress.</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm text-primary font-medium">Action needed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Takes 2 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to="/dashboard/daily-checkin">
                  <Button size="lg" className="scale-on-hover bg-primary hover:bg-primary/90 px-8 py-3 text-base font-semibold shadow-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Check-in
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">Current Streak</h3>
              </div>
              <div className="text-4xl font-bold gradient-text mb-1">{streakDays}</div>
              <p className="text-sm text-muted-foreground">consecutive days</p>
              <div className="mt-3 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-success to-success/70 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">This Week</h3>
              </div>
              <div className="text-4xl font-bold text-success mb-1">{weeklyCheckIns}/7</div>
              <p className="text-sm text-muted-foreground">check-ins completed</p>
              <Progress value={(weeklyCheckIns / 7) * 100} className="mt-3 shimmer-effect" />
            </CardContent>
          </Card>

          <Card className="dashboard-card bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">Total Check-ins</h3>
              </div>
              <div className="text-4xl font-bold text-accent mb-1">{totalCheckIns}</div>
              <p className="text-sm text-muted-foreground">since you started</p>
              {totalCheckIns > 0 && (
                <div className="flex items-center mt-3 space-x-1">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-xs text-accent font-medium">Milestone achieved!</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-card bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-warning to-warning/70 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold">Next Appointment</h3>
              </div>
              {upcomingAppointments.length > 0 ? (
                <>
                  <div className="text-lg font-bold text-warning mb-1">
                    {new Date(upcomingAppointments[0].appointment_date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">{upcomingAppointments[0].provider_name}</p>
                  <div className="flex items-center mt-3 space-x-1">
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                    <span className="text-xs text-warning font-medium">Upcoming</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-muted-foreground mb-1">None</div>
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  <Link to="/dashboard/appointments">
                    <Button variant="outline" size="sm" className="mt-3 scale-on-hover">
                      Schedule Now
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Dashboard Grid with New Layout */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold gradient-text">Recovery Tools</h2>
            <p className="text-muted-foreground">Everything you need for your journey</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <Link key={module.title} to={module.href}>
                <Card className={`dashboard-card group cursor-pointer h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-border/50 ${
                  module.special ? 'border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5' : ''
                }`} style={{animationDelay: `${index * 50}ms`}}>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-6 text-center relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${module.bgColor.replace('bg-', 'from-')} to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <module.icon className={`w-8 h-8 ${module.color} drop-shadow-lg`} />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{module.description}</p>
                    
                    {/* Special features for specific modules */}
                    {module.special && module.riskScore !== null && (
                      <div className={`p-3 rounded-xl border ${getRiskBgColor(module.riskScore)} mb-4`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Risk</span>
                          <span className={`text-lg font-bold ${getRiskColor(module.riskScore)}`}>
                            {module.riskScore}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {module.special && module.riskScore === null && (
                      <div className="text-center p-4 border-2 border-dashed border-muted rounded-xl mb-4">
                        <Calculator className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Take your first assessment</p>
                        <Button variant="outline" size="sm" className="scale-on-hover">
                          Start Now
                        </Button>
                      </div>
                    )}
                    
                    {module.title === "AI Chatbot" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          <span className="text-success font-medium">Available 24/7</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="mr-2">Access now</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Upcoming */}
        {(upcomingAppointments.length > 0 || todayCheckIn) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity & Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Recent Check-in */}
              {todayCheckIn && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span>Today's Check-in</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mood:</span>
                        <span className="font-medium">{todayCheckIn.mood ? `${todayCheckIn.mood}/10` : 'Not logged'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Stress:</span>
                        <span className="font-medium">{todayCheckIn.stress ? `${todayCheckIn.stress}/10` : 'Not logged'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sleep:</span>
                        <span className="font-medium">{todayCheckIn.sleep_hours ? `${todayCheckIn.sleep_hours}h` : 'Not logged'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Appointments */}
              {upcomingAppointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Upcoming Appointments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">{appointment.provider_name}</div>
                            <div className="text-sm text-muted-foreground">{appointment.provider_type}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.appointment_time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

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
    </div>
  );
};

export default Dashboard;