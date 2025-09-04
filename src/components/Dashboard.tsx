import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bell, Calculator, FileText, Calendar, Brain, Bot, User, Activity, Heart, Users, Stethoscope, MessageCircle, LogOut, TrendingUp, Clock, CheckCircle, Target } from "lucide-react";
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

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Current Streak</h3>
              </div>
              <div className="text-3xl font-bold text-primary">{streakDays}</div>
              <p className="text-sm text-muted-foreground">consecutive days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="font-semibold">This Week</h3>
              </div>
              <div className="text-3xl font-bold text-success">{weeklyCheckIns}/7</div>
              <p className="text-sm text-muted-foreground">check-ins completed</p>
              <Progress value={(weeklyCheckIns / 7) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Total Check-ins</h3>
              </div>
              <div className="text-3xl font-bold text-accent">{totalCheckIns}</div>
              <p className="text-sm text-muted-foreground">since you started</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-warning" />
                <h3 className="font-semibold">Next Appointment</h3>
              </div>
              {upcomingAppointments.length > 0 ? (
                <>
                  <div className="text-lg font-bold text-warning">
                    {new Date(upcomingAppointments[0].appointment_date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">{upcomingAppointments[0].provider_name}</p>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-muted-foreground">None</div>
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

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
      </main>
    </div>
  );
};

export default Dashboard;