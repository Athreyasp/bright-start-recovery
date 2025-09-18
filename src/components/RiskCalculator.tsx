import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, Loader2, Download, ExternalLink, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const recoveryResources = [
  {
    title: "Recovery from Addiction - Complete Guide",
    type: "YouTube Video",
    url: "https://www.youtube.com/watch?v=7CVYDG9ywnI",
    description: "Comprehensive guide to understanding and overcoming addiction"
  },
  {
    title: "The Science of Addiction Recovery",
    type: "YouTube Video",
    url: "https://www.youtube.com/watch?v=H0WHkP5WNYI",
    description: "Understanding brain chemistry and addiction recovery process"
  },
  {
    title: "Daily Recovery Practices & Habits",
    type: "YouTube Video", 
    url: "https://www.youtube.com/watch?v=aFLCdaOF6YE",
    description: "Practical daily habits for maintaining sobriety and recovery"
  },
  {
    title: "Guided Meditation for Addiction Recovery",
    type: "YouTube Video",
    url: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    description: "10-minute guided meditation to reduce cravings and stress"
  },
  {
    title: "Breathing Exercises for Cravings",
    type: "YouTube Video", 
    url: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    description: "Instant techniques to manage cravings and urges"
  },
  {
    title: "The Body Keeps the Score by Bessel van der Kolk",
    type: "Book",
    url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748",
    description: "Essential reading on trauma and recovery - highly recommended for addiction recovery"
  },
  {
    title: "Atomic Habits by James Clear",
    type: "Book",
    url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    description: "Building healthy habits and breaking destructive patterns"
  },
  {
    title: "Clean by David Sheff",
    type: "Book",
    url: "https://www.amazon.com/Clean-Overcoming-Addiction-Ending-Americas/dp/0544112326",
    description: "Comprehensive guide to overcoming addiction and ending America's greatest tragedy"
  },
  {
    title: "SAMHSA National Helpline",
    type: "Emergency Support",
    url: "https://www.samhsa.gov/find-help/national-helpline",
    description: "Call 1-800-662-4357 for 24/7 treatment referral and information"
  },
  {
    title: "Narcotics Anonymous",
    type: "Support Group",
    url: "https://www.na.org/",
    description: "Find local NA meetings and support groups"
  },
  {
    title: "Alcoholics Anonymous",
    type: "Support Group",
    url: "https://www.aa.org/",
    description: "Find local AA meetings and support groups"
  }
];

const RiskCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    yearsOfUse: 0,
    substances: [] as string[],
    frequency: "",
    stressLevel: [5],
    sleepQuality: [5],
    supportSystem: "",
    lastRelapse: "",
    triggers: [] as string[],
    copingStrategies: [] as string[],
  });
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Load previous assessment if exists
    if (user) {
      loadPreviousAssessment();
    }
  }, [user]);

  const loadPreviousAssessment = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const assessment = data[0];
        const responses = assessment.responses as any;
        setFormData({
          yearsOfUse: responses.yearsOfUse || 0,
          substances: responses.substances || [],
          frequency: responses.frequency || '',
          stressLevel: [responses.stressLevel || 5],
          sleepQuality: [responses.sleepQuality || 5],
          supportSystem: responses.supportSystem || '',
          lastRelapse: responses.lastRelapse || '',
          triggers: responses.triggers || [],
          copingStrategies: responses.copingStrategies || [],
        });
        setRiskScore(assessment.score);
        setRecommendations(responses.recommendations || []);
        if (assessment.score !== null) {
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error('Error loading previous assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRisk = async () => {
    if (!user) return;

    setSaving(true);
    
    // Simple risk calculation algorithm
    let score = 0;
    
    // Years of use factor
    if (formData.yearsOfUse > 10) score += 30;
    else if (formData.yearsOfUse > 5) score += 20;
    else if (formData.yearsOfUse > 2) score += 10;
    
    // Frequency factor
    if (formData.frequency === "daily") score += 25;
    else if (formData.frequency === "weekly") score += 15;
    else if (formData.frequency === "monthly") score += 5;
    
    // Stress level (higher stress = higher risk)
    score += formData.stressLevel[0] * 2;
    
    // Sleep quality (poor sleep = higher risk)
    score += (10 - formData.sleepQuality[0]) * 2;
    
    // Support system
    if (formData.supportSystem === "none") score += 20;
    else if (formData.supportSystem === "limited") score += 10;
    
    // Recent relapse
    if (formData.lastRelapse === "recent") score += 25;
    else if (formData.lastRelapse === "within-year") score += 15;
    
    // Trigger factors (higher number of triggers = higher risk)
    score += formData.triggers.length * 3;
    
    // Coping strategies (more strategies = lower risk)
    score -= formData.copingStrategies.length * 2;
    
    const finalScore = Math.min(Math.max(score, 0), 100);
    const recs = getRecommendations(finalScore);
    
    // Save to database
    try {
      const responseData = {
        yearsOfUse: formData.yearsOfUse,
        substances: formData.substances,
        frequency: formData.frequency,
        stressLevel: formData.stressLevel[0],
        sleepQuality: formData.sleepQuality[0],
        supportSystem: formData.supportSystem,
        lastRelapse: formData.lastRelapse,
        triggers: formData.triggers,
        copingStrategies: formData.copingStrategies,
        recommendations: recs
      };

      const { error } = await supabase.from('risk_assessments').insert({
        user_id: user.id,
        score: finalScore,
        responses: responseData
      });

      if (error) throw error;

      setRiskScore(finalScore);
      setRecommendations(recs);
      setShowResults(true);
      
      toast({
        title: "Assessment Complete",
        description: "Your risk assessment has been saved and personalized recommendations generated.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const generatePersonalizedCrisisPlan = () => {
    if (!user || riskScore === null) return;

    const currentDate = new Date().toLocaleDateString();
    const userName = user.email.split('@')[0]; // Use email prefix as name fallback
    
    const emergencyContacts = [
      "SAMHSA National Helpline: 1-800-662-4357",
      "Crisis Text Line: Text HOME to 741741",
      "National Suicide Prevention Lifeline: 988",
      "Local Emergency Services: 911"
    ];

    const riskLevel = riskScore > 70 ? 'HIGH RISK' : riskScore > 30 ? 'MODERATE RISK' : 'LOW RISK';
    
    const plan = `
PERSONAL CRISIS PLAN - ${userName.toUpperCase()}
Generated: ${currentDate}
Risk Level: ${riskLevel} (${riskScore}%)

===========================================
EMERGENCY CONTACTS (Call immediately in crisis)
===========================================
${emergencyContacts.map(contact => `• ${contact}`).join('\n')}

===========================================
MY RISK FACTORS
===========================================
Substance History: ${formData.yearsOfUse} years
Usage Pattern: ${formData.frequency}
Stress Level: ${formData.stressLevel[0]}/10
Sleep Quality: ${formData.sleepQuality[0]}/10
Support System: ${formData.supportSystem}
Last Relapse: ${formData.lastRelapse}

My Known Triggers:
${formData.triggers.map(trigger => `• ${trigger}`).join('\n') || '• Identify and document your personal triggers'}

===========================================
MY COPING STRATEGIES
===========================================
${formData.copingStrategies.map(strategy => `• ${strategy}`).join('\n') || '• Develop and practice healthy coping mechanisms'}

Additional Emergency Strategies:
• Call my sponsor or support person immediately
• Remove myself from triggering situations
• Use grounding techniques (5-4-3-2-1 method)
• Practice deep breathing exercises
• Attend an emergency AA/NA meeting
• Go to a safe place (family, friend, treatment center)

===========================================
MY PERSONALIZED RECOMMENDATIONS
===========================================
${recommendations.map(rec => `• ${rec}`).join('\n')}

===========================================
MY RECOVERY RESOURCES
===========================================
${recoveryResources.slice(0, 5).map(resource => `• ${resource.title}: ${resource.url}`).join('\n')}

===========================================
MY PERSONAL COMMITMENT
===========================================
I commit to:
• Calling for help immediately when I feel unsafe or triggered
• Following my treatment plan consistently
• Being honest with my support network about my struggles
• Attending regular meetings and therapy sessions
• Using my coping strategies before situations escalate
• Staying connected with my recovery community

Risk Assessment Score: ${riskScore}% (${riskLevel})
Assessment Date: ${currentDate}

This plan is personalized based on my risk assessment on ${currentDate}.
I will review and update this plan regularly with my healthcare provider.

Remember: Recovery is a daily choice. You have the strength to overcome challenges.
One day at a time. You are not alone in this journey.
`;

    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Risk_Crisis_Plan_${userName}_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Crisis Plan Downloaded",
      description: "Your personalized crisis plan has been saved to your device"
    });
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Low", color: "text-success", icon: CheckCircle };
    if (score <= 70) return { level: "Moderate", color: "text-warning", icon: AlertTriangle };
    return { level: "High", color: "text-destructive", icon: AlertTriangle };
  };

  const getRecommendations = (score: number) => {
    if (score <= 30) return [
      "Continue your current recovery practices",
      "Maintain regular check-ins with your support network",
      "Consider preventive counseling sessions",
      "Keep up healthy lifestyle habits",
      "Schedule regular medical check-ups"
    ];
    
    if (score <= 70) return [
      "Increase frequency of support group meetings",
      "Schedule regular therapy sessions",
      "Implement stress management techniques",
      "Consider intensive outpatient programs",
      "Strengthen your support network",
      "Create a detailed relapse prevention plan"
    ];
    
    return [
      "Seek immediate professional help",
      "Consider residential treatment options",
      "Daily check-ins with counselor or sponsor",
      "Remove triggers from environment",
      "Activate crisis intervention plan",
      "Contact emergency support immediately if needed",
      "Consider medication-assisted treatment"
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-poppins p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (showResults && riskScore !== null) {
    const riskInfo = getRiskLevel(riskScore);
    const Icon = riskInfo.icon;
    
    return (
      <div className="min-h-screen bg-background font-poppins p-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - riskScore / 100)}`}
                      className={riskInfo.color}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <Icon className={`w-12 h-12 ${riskInfo.color} mb-2`} />
                    <div className={`text-4xl font-bold ${riskInfo.color}`}>{riskScore}%</div>
                    <div className="text-lg font-semibold">{riskInfo.level} Risk</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Risk Factors Identified</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Substance History:</span>
                      <span className="font-medium">{formData.yearsOfUse} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage Pattern:</span>
                      <span className="font-medium capitalize">{formData.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stress Level:</span>
                      <span className="font-medium">{formData.stressLevel[0]}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleep Quality:</span>
                      <span className="font-medium">{formData.sleepQuality[0]}/10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 ${
                    riskScore <= 30 ? 'bg-success/10 border-l-success' :
                    riskScore <= 70 ? 'bg-warning/10 border-l-warning' : 
                    'bg-destructive/10 border-l-destructive'
                  }`}>
                    <h4 className="font-semibold mb-2">Immediate Actions:</h4>
                    <ul className="space-y-2">
                      {recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-success flex-shrink-0" />
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/dashboard/appointments">
                      <Button className="w-full">Schedule Professional Consultation</Button>
                    </Link>
                    <Link to="/dashboard/psychology-professionals">
                      <Button variant="secondary" className="w-full">Explore Psychology Professionals</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={generatePersonalizedCrisisPlan}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download My Crisis Plan
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>This assessment is for informational purposes only and should not replace professional medical advice.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recovery Resources */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Recovery Resources & Support
              </CardTitle>
              <p className="text-muted-foreground">
                Professional resources to help you overcome addiction and improve your well-being
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recoveryResources.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{resource.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {resource.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {resource.type === 'Emergency Support' ? 'Get Help' : 
                         resource.type === 'Book' ? 'Buy Book' : 
                         resource.type === 'Support Group' ? 'Find Meetings' : 'Watch'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center space-y-4">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-poppins p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Relapse Risk Assessment</CardTitle>
            <p className="text-muted-foreground">
              Answer these questions honestly to get personalized insights and recommendations for your recovery journey.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="yearsOfUse">How many years have you used substances?</Label>
              <Input
                id="yearsOfUse"
                type="number"
                placeholder="Enter number of years"
                value={formData.yearsOfUse}
                onChange={(e) => setFormData({...formData, yearsOfUse: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-3">
              <Label>Substances used (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {["Alcohol","Tobacco/Nicotine","Opioids","Stimulants","Other"].map((sub) => (
                  <div key={sub} className="flex items-center space-x-2">
                    <Checkbox
                      id={sub}
                      checked={formData.substances.includes(sub.toLowerCase())}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            substances: [...formData.substances, sub.toLowerCase()]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            substances: formData.substances.filter(s => s !== sub.toLowerCase())
                          });
                        }
                      }}
                    />
                    <Label htmlFor={sub} className="text-sm">{sub}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Frequency of past use</Label>
              <RadioGroup value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="occasional" id="occasional" />
                  <Label htmlFor="occasional">Occasionally</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Current stress level (1 = Low, 10 = High)</Label>
              <Slider
                value={formData.stressLevel}
                onValueChange={(value) => setFormData({...formData, stressLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                Current level: {formData.stressLevel[0]}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Sleep quality (1 = Poor, 10 = Excellent)</Label>
              <Slider
                value={formData.sleepQuality}
                onValueChange={(value) => setFormData({...formData, sleepQuality: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                Current quality: {formData.sleepQuality[0]}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Support system strength</Label>
              <RadioGroup value={formData.supportSystem} onValueChange={(value) => setFormData({...formData, supportSystem: value})}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strong" id="strong" />
                  <Label htmlFor="strong">Strong (family, friends, groups)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate (some support)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited">Limited support</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">No support system</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Last relapse or significant craving</Label>
              <RadioGroup value={formData.lastRelapse} onValueChange={(value) => setFormData({...formData, lastRelapse: value})}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never relapsed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recent" id="recent" />
                  <Label htmlFor="recent">Within last month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="within-year" id="within-year" />
                  <Label htmlFor="within-year">Within last year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-year" id="over-year" />
                  <Label htmlFor="over-year">Over a year ago</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Common triggers (check all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Stress at work",
                  "Financial problems", 
                  "Relationship issues",
                  "Social pressure",
                  "Boredom",
                  "Depression/Anxiety",
                  "Physical pain",
                  "Being around substance use"
                ].map((trigger) => (
                  <div key={trigger} className="flex items-center space-x-2">
                    <Checkbox
                      id={trigger}
                      checked={formData.triggers.includes(trigger)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            triggers: [...formData.triggers, trigger]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            triggers: formData.triggers.filter(t => t !== trigger)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={trigger} className="text-sm">{trigger}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Coping strategies you use (check all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Exercise/Physical activity",
                  "Meditation/Mindfulness",
                  "Support group meetings",
                  "Talking to friends/family",
                  "Therapy sessions",
                  "Journaling",
                  "Creative activities",
                  "Professional counseling"
                ].map((strategy) => (
                  <div key={strategy} className="flex items-center space-x-2">
                    <Checkbox
                      id={strategy}
                      checked={formData.copingStrategies.includes(strategy)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            copingStrategies: [...formData.copingStrategies, strategy]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            copingStrategies: formData.copingStrategies.filter(s => s !== strategy)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={calculateRisk} 
              className="w-full" 
              size="lg"
              disabled={!formData.substances.length || !formData.frequency || !formData.supportSystem || !formData.lastRelapse || saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Saving Assessment..." : "Calculate My Risk Score"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskCalculator;