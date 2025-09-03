import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";

const RiskCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    yearsOfUse: 0,
    substanceType: "",
    frequency: "",
    stressLevel: [5],
    sleepQuality: [5],
    supportSystem: "",
    lastRelapse: "",
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
          substanceType: responses.substanceType || '',
          frequency: responses.frequency || '',
          stressLevel: [responses.stressLevel || 5],
          sleepQuality: [responses.sleepQuality || 5],
          supportSystem: responses.supportSystem || '',
          lastRelapse: responses.lastRelapse || '',
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
    
    const finalScore = Math.min(Math.max(score, 0), 100);
    const recs = getRecommendations(finalScore);
    
    // Save to database
    try {
      const responseData = {
        yearsOfUse: formData.yearsOfUse,
        substanceType: formData.substanceType,
        frequency: formData.frequency,
        stressLevel: formData.stressLevel[0],
        sleepQuality: formData.sleepQuality[0],
        supportSystem: formData.supportSystem,
        lastRelapse: formData.lastRelapse,
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
                    <Link to="/dashboard/chatbot">
                      <Button variant="secondary" className="w-full">Chat with AI Support</Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={() => {
                      // Generate and download crisis plan
                      toast({
                        title: "Crisis Plan",
                        description: "Your personalized crisis plan will be available soon.",
                      });
                    }}>
                      Download Crisis Plan
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>This assessment is for informational purposes only and should not replace professional medical advice.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
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
              <Label>Primary substance type</Label>
              <RadioGroup value={formData.substanceType} onValueChange={(value) => setFormData({...formData, substanceType: value})}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alcohol" id="alcohol" />
                  <Label htmlFor="alcohol">Alcohol</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tobacco" id="tobacco" />
                  <Label htmlFor="tobacco">Tobacco/Nicotine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opioids" id="opioids" />
                  <Label htmlFor="opioids">Opioids</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stimulants" id="stimulants" />
                  <Label htmlFor="stimulants">Stimulants</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
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

            <Button 
              onClick={calculateRisk} 
              className="w-full" 
              size="lg"
              disabled={!formData.substanceType || !formData.frequency || !formData.supportSystem || !formData.lastRelapse || saving}
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