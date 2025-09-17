import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Heart, Brain, Activity, ArrowLeft, ExternalLink, Play, Download } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StressAssessment {
  id?: string;
  user_id: string;
  stress_level: number;
  sleep_hours: number;
  exercise_frequency: number;
  work_pressure: number;
  relationship_stress: number;
  financial_stress: number;
  health_concerns: number;
  social_support: number;
  coping_mechanisms: string;
  stress_triggers: string;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  total_score: number;
  stress_category: string;
  recommendations: string[];
  created_at?: string;
}

const physicalSymptoms = [
  'Headaches', 'Muscle tension', 'Fatigue', 'Sleep problems', 
  'Digestive issues', 'High blood pressure', 'Chest pain', 'Rapid heartbeat'
];

const emotionalSymptoms = [
  'Anxiety', 'Depression', 'Irritability', 'Mood swings',
  'Feeling overwhelmed', 'Low motivation', 'Restlessness', 'Difficulty concentrating'
];

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
    title: "Progressive Muscle Relaxation for Recovery",
    type: "YouTube Video",
    url: "https://www.youtube.com/watch?v=86HUcX8ZtAk",
    description: "Full body relaxation to release tension and anxiety"
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
    title: "The Craving Mind by Judson Brewer",
    type: "Book",
    url: "https://www.amazon.com/Craving-Mind-Cigarettes-Smartphones-Facebook/dp/0300234538",
    description: "Understanding and overcoming addictive behaviors through mindfulness"
  },
  {
    title: "SAMHSA National Helpline",
    type: "Emergency Support",
    url: "https://www.samhsa.gov/find-help/national-helpline",
    description: "Call 1-800-662-4357 for 24/7 treatment referral and information"
  },
  {
    title: "Crisis Text Line",
    type: "Emergency Support",
    url: "https://www.crisistextline.org/",
    description: "Text HOME to 741741 for immediate crisis support"
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

export default function StressCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<StressAssessment>>({
    stress_level: 5,
    sleep_hours: 7,
    exercise_frequency: 3,
    work_pressure: 5,
    relationship_stress: 3,
    financial_stress: 3,
    health_concerns: 2,
    social_support: 7,
    coping_mechanisms: '',
    stress_triggers: '',
    physical_symptoms: [],
    emotional_symptoms: []
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    category: string;
    recommendations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreviousAssessment();
    }
  }, [user]);

  const loadPreviousAssessment = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stress_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setFormData(data);
        setResults({
          score: data.total_score,
          category: data.stress_category,
          recommendations: data.recommendations
        });
        setShowResults(true);
      }
    } catch (error) {
      console.log('No previous assessment found');
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptom: string, type: 'physical' | 'emotional') => {
    const field = type === 'physical' ? 'physical_symptoms' : 'emotional_symptoms';
    const currentSymptoms = formData[field] || [];
    
    if (currentSymptoms.includes(symptom)) {
      setFormData({
        ...formData,
        [field]: currentSymptoms.filter(s => s !== symptom)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentSymptoms, symptom]
      });
    }
  };

  const calculateStressScore = () => {
    const {
      stress_level = 0,
      sleep_hours = 8,
      exercise_frequency = 5,
      work_pressure = 0,
      relationship_stress = 0,
      financial_stress = 0,
      health_concerns = 0,
      social_support = 10,
      physical_symptoms = [],
      emotional_symptoms = []
    } = formData;

    // Calculate base score from factors (0-100 scale)
    let score = 0;
    
    // Primary stress level (0-10 scale, weight: 20%)
    score += (stress_level / 10) * 20;
    
    // Sleep impact (less sleep = higher stress, weight: 15%)
    const sleepScore = sleep_hours < 6 ? 15 : sleep_hours < 7 ? 10 : sleep_hours < 8 ? 5 : 0;
    score += sleepScore;
    
    // Exercise impact (less exercise = higher stress, weight: 10%)
    const exerciseScore = exercise_frequency < 2 ? 10 : exercise_frequency < 4 ? 6 : exercise_frequency < 6 ? 3 : 0;
    score += exerciseScore;
    
    // Stress factors (each 0-10 scale, combined weight: 30%)
    score += ((work_pressure + relationship_stress + financial_stress + health_concerns) / 40) * 30;
    
    // Social support (inverted - more support = less stress, weight: 10%)
    score += ((10 - social_support) / 10) * 10;
    
    // Symptoms (weight: 15%)
    const symptomScore = (physical_symptoms.length + emotional_symptoms.length) * 0.9375; // 15/16 symptoms max
    score += Math.min(symptomScore, 15);

    const finalScore = Math.round(Math.min(score, 100));
    
    let category: string;
    let recommendations: string[];
    
    if (finalScore <= 30) {
      category = 'Low Stress';
      recommendations = [
        'Continue your current stress management practices',
        'Maintain regular exercise and sleep schedule',
        'Practice preventive stress management techniques',
        'Consider helping others who may be struggling with stress'
      ];
    } else if (finalScore <= 60) {
      category = 'Moderate Stress';
      recommendations = [
        'Implement daily stress reduction techniques like meditation',
        'Improve sleep hygiene and aim for 7-9 hours of sleep',
        'Increase physical activity to at least 30 minutes daily',
        'Consider talking to a counselor or therapist',
        'Practice deep breathing exercises throughout the day'
      ];
    } else {
      category = 'High Stress';
      recommendations = [
        'Seek professional help from a mental health provider',
        'Consider stress management counseling or therapy',
        'Implement immediate stress relief techniques',
        'Prioritize self-care and set boundaries',
        'Consider medication consultation with a healthcare provider',
        'Reach out to your support network immediately'
      ];
    }

    return { score: finalScore, category, recommendations };
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your assessment",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const calculatedResults = calculateStressScore();
    
    try {
      const assessmentData = {
        user_id: user.id,
        stress_level: formData.stress_level || 5,
        sleep_hours: formData.sleep_hours || 7,
        exercise_frequency: formData.exercise_frequency || 3,
        work_pressure: formData.work_pressure || 0,
        relationship_stress: formData.relationship_stress || 0,
        financial_stress: formData.financial_stress || 0,
        health_concerns: formData.health_concerns || 0,
        social_support: formData.social_support || 7,
        coping_mechanisms: formData.coping_mechanisms || '',
        stress_triggers: formData.stress_triggers || '',
        physical_symptoms: formData.physical_symptoms || [],
        emotional_symptoms: formData.emotional_symptoms || [],
        total_score: calculatedResults.score,
        stress_category: calculatedResults.category,
        recommendations: calculatedResults.recommendations
      };

      const { error } = await supabase
        .from('stress_assessments')
        .insert(assessmentData);

      if (error) throw error;

      setResults(calculatedResults);
      setShowResults(true);
      
      toast({
        title: "Assessment completed",
        description: "Your stress assessment has been saved successfully"
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

  const getStressColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressIcon = (score: number) => {
    if (score <= 30) return <Heart className="w-6 h-6 text-green-600" />;
    if (score <= 60) return <Brain className="w-6 h-6 text-yellow-600" />;
    return <AlertCircle className="w-6 h-6 text-red-600" />;
  };

  const generatePersonalizedCrisisPlan = () => {
    if (!results || !formData || !user) return;

    const currentDate = new Date().toLocaleDateString();
    const userName = user.email.split('@')[0]; // Use email prefix as name fallback
    
    const emergencyContacts = [
      "SAMHSA National Helpline: 1-800-662-4357",
      "Crisis Text Line: Text HOME to 741741",
      "National Suicide Prevention Lifeline: 988",
      "Local Emergency Services: 911"
    ];

    const personalizedTriggers = formData.stress_triggers ? 
      formData.stress_triggers.split(',').map(t => t.trim()).filter(t => t.length > 0) : 
      ['High stress situations', 'Overwhelming emotions', 'Social conflicts'];

    const personalizedCoping = formData.coping_mechanisms ? 
      formData.coping_mechanisms.split(',').map(c => c.trim()).filter(c => c.length > 0) : 
      ['Deep breathing exercises', 'Call a support person', 'Remove yourself from triggers'];

    const riskLevel = results.score > 60 ? 'HIGH RISK' : results.score > 30 ? 'MODERATE RISK' : 'LOW RISK';
    
    const plan = `
PERSONAL CRISIS PLAN - ${userName.toUpperCase()}
Generated: ${currentDate}
Risk Level: ${riskLevel}

===========================================
EMERGENCY CONTACTS (Call immediately in crisis)
===========================================
${emergencyContacts.map(contact => `• ${contact}`).join('\n')}

===========================================
MY PERSONAL WARNING SIGNS
===========================================
Physical Symptoms:
${(formData.physical_symptoms || []).map(symptom => `• ${symptom}`).join('\n') || '• Monitor for changes in physical well-being'}

Emotional Symptoms:
${(formData.emotional_symptoms || []).map(symptom => `• ${symptom}`).join('\n') || '• Monitor for changes in emotional state'}

My Stress Triggers:
${personalizedTriggers.map(trigger => `• ${trigger}`).join('\n')}

===========================================
MY COPING STRATEGIES
===========================================
${personalizedCoping.map(coping => `• ${coping}`).join('\n')}

Additional Strategies:
• Practice 4-7-8 breathing (4 seconds in, 7 hold, 8 out)
• Use grounding techniques (5-4-3-2-1 method)
• Reach out to my support network
• Remove myself from triggering situations
• Use positive self-talk and affirmations

===========================================
MY RECOVERY RESOURCES
===========================================
${recoveryResources.slice(0, 5).map(resource => `• ${resource.title}: ${resource.url}`).join('\n')}

===========================================
MY PERSONAL COMMITMENT
===========================================
I commit to:
• Contacting help immediately when I feel unsafe
• Using my coping strategies before situations escalate
• Being honest with my support network about my struggles
• Attending regular check-ins with healthcare providers
• Following my treatment plan consistently

Current Stress Level: ${results.score}/100 (${results.category})
Sleep Average: ${formData.sleep_hours || 'Not specified'} hours
Exercise Frequency: ${formData.exercise_frequency || 'Not specified'} days/week

This plan is personalized based on my assessment on ${currentDate}.
I will review and update this plan regularly with my healthcare provider.

Remember: Recovery is a journey, not a destination. Each day sober is a victory.
`;

    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crisis_Plan_${userName}_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Crisis Plan Downloaded",
      description: "Your personalized crisis plan has been saved to your device"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStressIcon(results.score)}
            </div>
            <CardTitle className="text-3xl">Your Stress Assessment Results</CardTitle>
            <CardDescription>
              Based on your responses, here's your stress analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getStressColor(results.score)}`}>
                {results.score}/100
              </div>
              <Badge variant={results.score <= 30 ? "default" : results.score <= 60 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
                {results.category}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
              <div className="grid gap-3">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Activity className="w-5 h-5 text-primary mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Recovery Resources & Support
            </CardTitle>
            <CardDescription>
              Professional resources to help you overcome addiction and improve your well-being
            </CardDescription>
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

        <div className="flex gap-4 mt-8">
          <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1">
            Retake Assessment
          </Button>
          <Button 
            onClick={generatePersonalizedCrisisPlan}
            variant="secondary" 
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download My Crisis Plan
          </Button>
          <Button asChild className="flex-1">
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/dashboard" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Stress Level Assessment</CardTitle>
          <CardDescription>
            This comprehensive assessment will help evaluate your current stress levels and provide personalized recommendations for stress management and recovery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Stress Level */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Overall Stress Level (0-10)</Label>
            <div className="px-3">
              <Slider
                value={[formData.stress_level || 5]}
                onValueChange={(value) => setFormData({ ...formData, stress_level: value[0] })}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>No stress</span>
                <span className="font-medium">Current: {formData.stress_level}/10</span>
                <span>Extreme stress</span>
              </div>
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-4">
            <Label htmlFor="sleep" className="text-base font-medium">Average Hours of Sleep per Night</Label>
            <Input
              id="sleep"
              type="number"
              min="0"
              max="12"
              step="0.5"
              value={formData.sleep_hours || ''}
              onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })}
              placeholder="7.5"
            />
          </div>

          {/* Exercise Frequency */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Exercise Frequency (days per week)</Label>
            <div className="px-3">
              <Slider
                value={[formData.exercise_frequency || 3]}
                onValueChange={(value) => setFormData({ ...formData, exercise_frequency: value[0] })}
                max={7}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Never</span>
                <span className="font-medium">Current: {formData.exercise_frequency} days/week</span>
                <span>Daily</span>
              </div>
            </div>
          </div>

          {/* Stress Factors */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Stress Factors (Rate 0-10)</h3>
            
            <div className="grid gap-6">
              {[
                { key: 'work_pressure', label: 'Work/School Pressure' },
                { key: 'relationship_stress', label: 'Relationship Stress' },
                { key: 'financial_stress', label: 'Financial Stress' },
                { key: 'health_concerns', label: 'Health Concerns' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium">{label}</Label>
                  <div className="px-3">
                    <Slider
                      value={[formData[key as keyof StressAssessment] as number || 0]}
                      onValueChange={(value) => setFormData({ ...formData, [key]: value[0] })}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>None</span>
                      <span>{formData[key as keyof StressAssessment] || 0}/10</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Support */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Social Support Level (0-10)</Label>
            <div className="px-3">
              <Slider
                value={[formData.social_support || 7]}
                onValueChange={(value) => setFormData({ ...formData, social_support: value[0] })}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>No support</span>
                <span className="font-medium">Current: {formData.social_support}/10</span>
                <span>Strong support</span>
              </div>
            </div>
          </div>

          {/* Physical Symptoms */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Physical Symptoms (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {physicalSymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`physical-${symptom}`}
                    checked={(formData.physical_symptoms || []).includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom, 'physical')}
                    className="rounded"
                  />
                  <Label htmlFor={`physical-${symptom}`} className="text-sm">{symptom}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Symptoms */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Emotional Symptoms (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {emotionalSymptoms.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`emotional-${symptom}`}
                    checked={(formData.emotional_symptoms || []).includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom, 'emotional')}
                    className="rounded"
                  />
                  <Label htmlFor={`emotional-${symptom}`} className="text-sm">{symptom}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="triggers" className="text-base font-medium">What triggers your stress?</Label>
              <Textarea
                id="triggers"
                value={formData.stress_triggers || ''}
                onChange={(e) => setFormData({ ...formData, stress_triggers: e.target.value })}
                placeholder="Describe situations, people, or events that increase your stress levels..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coping" className="text-base font-medium">Current coping mechanisms</Label>
              <Textarea
                id="coping"
                value={formData.coping_mechanisms || ''}
                onChange={(e) => setFormData({ ...formData, coping_mechanisms: e.target.value })}
                placeholder="Describe how you currently manage stress (exercise, meditation, hobbies, etc.)..."
                rows={3}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            size="lg"
            disabled={saving}
          >
            {saving ? 'Calculating...' : 'Calculate My Stress Level'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}