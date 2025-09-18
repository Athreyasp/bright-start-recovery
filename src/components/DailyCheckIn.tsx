import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Heart, Brain, Moon, Activity, Target, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/ClerkAuthContext";
import { supabase } from '@/integrations/supabase/client'
import { useToast } from "@/hooks/use-toast";

const DailyCheckIn = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingCheckIn, setExistingCheckIn] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    moodScore: [7],
    stressLevel: [5],
    sleepHours: 7.5,
    exerciseMinutes: 30,
    cravingIntensity: [0],
    notes: "",
    triggers: [] as string[],
    copingStrategies: [] as string[]
  });

  const triggerOptions = [
    "Work stress", "Family conflict", "Social pressure", "Loneliness", 
    "Boredom", "Financial worry", "Relationship issues", "Physical pain",
    "Social media", "Certain locations", "Specific people", "Weather changes"
  ];

  const copingOptions = [
    "Deep breathing", "Exercise", "Meditation", "Called support person",
    "Journaling", "Music therapy", "Art/creativity", "Reading",
    "Walked outside", "Healthy snack", "Took a shower", "Watched comedy"
  ];

  useEffect(() => {
    if (user) {
      loadTodaysCheckIn();
    }
  }, [user]);

  const loadTodaysCheckIn = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data) {
        setExistingCheckIn(data);
        setFormData({
          moodScore: [data.mood],
          stressLevel: [data.stress],
          sleepHours: data.sleep_hours,
          exerciseMinutes: data.exercise_minutes,
          cravingIntensity: [data.cravings],
          notes: data.notes || "",
          triggers: data.triggers || [],
          copingStrategies: data.coping_strategies || []
        });
      }
    } catch (error) {
      console.error('Error loading today\'s check-in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerToggle = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }));
  };

  const handleCopingToggle = (strategy: string) => {
    setFormData(prev => ({
      ...prev,
      copingStrategies: prev.copingStrategies.includes(strategy)
        ? prev.copingStrategies.filter(s => s !== strategy)
        : [...prev.copingStrategies, strategy]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const checkInData = {
        user_id: user.id,
        date: today,
        mood: formData.moodScore[0],
        stress: formData.stressLevel[0],
        sleep_hours: formData.sleepHours,
        exercise_minutes: formData.exerciseMinutes,
        cravings: formData.cravingIntensity[0],
        notes: formData.notes,
        triggers: formData.triggers,
        coping_strategies: formData.copingStrategies
      };

      let error;
      if (existingCheckIn) {
        // Update existing check-in
        const result = await supabase
          .from('daily_check_ins')
          .update(checkInData)
          .eq('id', existingCheckIn.id);
        error = result.error;
      } else {
        // Insert new check-in
        const result = await supabase
          .from('daily_check_ins')
          .insert(checkInData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Check-in Complete!",
        description: existingCheckIn ? "Your daily check-in has been updated." : "Thank you for completing your daily check-in.",
      });

      // Refresh data
      await loadTodaysCheckIn();
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-poppins p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your check-in...</p>
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
            <CardTitle className="flex items-center text-2xl">
              <Heart className="w-6 h-6 mr-2 text-primary" />
              Daily Check-In
            </CardTitle>
            <p className="text-muted-foreground">
              {existingCheckIn 
                ? "Update your daily check-in for today. Taking a moment to reflect helps track your progress."
                : "Take a moment to reflect on your day. This helps track your progress and identify patterns."
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Mood Score */}
            <div className="space-y-3">
              <Label className="flex items-center text-lg">
                <Brain className="w-5 h-5 mr-2" />
                How is your mood today? (1 = Very Low, 10 = Excellent)
              </Label>
              <Slider
                value={formData.moodScore}
                onValueChange={(value) => setFormData({...formData, moodScore: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{formData.moodScore[0]}</span>
                <p className="text-sm text-muted-foreground">
                  {formData.moodScore[0] <= 3 && "Consider reaching out for support today"}
                  {formData.moodScore[0] > 3 && formData.moodScore[0] <= 7 && "You're doing okay - keep going!"}
                  {formData.moodScore[0] > 7 && "Great to see you feeling positive!"}
                </p>
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <Label className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2" />
                Current stress level (1 = Very Calm, 10 = Very Stressed)
              </Label>
              <Slider
                value={formData.stressLevel}
                onValueChange={(value) => setFormData({...formData, stressLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{formData.stressLevel[0]}</span>
                <p className="text-sm text-muted-foreground">
                  {formData.stressLevel[0] <= 4 && "Nice! You're managing stress well"}
                  {formData.stressLevel[0] > 4 && formData.stressLevel[0] <= 7 && "Moderate stress - try some coping strategies"}
                  {formData.stressLevel[0] > 7 && "High stress detected - please prioritize self-care"}
                </p>
              </div>
            </div>

            {/* Sleep and Exercise */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  Hours of sleep last night
                </Label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Exercise minutes today
                </Label>
                <input
                  type="number"
                  min="0"
                  value={formData.exerciseMinutes}
                  onChange={(e) => setFormData({...formData, exerciseMinutes: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {/* Craving Intensity */}
            <div className="space-y-3">
              <Label className="text-lg">
                Craving intensity today (0 = None, 10 = Overwhelming)
              </Label>
              <Slider
                value={formData.cravingIntensity}
                onValueChange={(value) => setFormData({...formData, cravingIntensity: value})}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{formData.cravingIntensity[0]}</span>
                <p className="text-sm text-muted-foreground">
                  {formData.cravingIntensity[0] === 0 && "Excellent! No cravings today"}
                  {formData.cravingIntensity[0] > 0 && formData.cravingIntensity[0] <= 3 && "Mild cravings - you're managing well"}
                  {formData.cravingIntensity[0] > 3 && formData.cravingIntensity[0] <= 7 && "Moderate cravings - use your coping strategies"}
                  {formData.cravingIntensity[0] > 7 && "Strong cravings - consider reaching out for support"}
                </p>
              </div>
            </div>

            {/* Triggers */}
            <div className="space-y-4">
              <Label className="text-lg">What triggers did you encounter today?</Label>
              <div className="grid grid-cols-2 gap-2">
                {triggerOptions.map((trigger) => (
                  <div key={trigger} className="flex items-center space-x-2">
                    <Checkbox
                      id={`trigger-${trigger}`}
                      checked={formData.triggers.includes(trigger)}
                      onCheckedChange={() => handleTriggerToggle(trigger)}
                    />
                    <Label htmlFor={`trigger-${trigger}`} className="text-sm cursor-pointer">
                      {trigger}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="space-y-4">
              <Label className="text-lg">What coping strategies did you use?</Label>
              <div className="grid grid-cols-2 gap-2">
                {copingOptions.map((strategy) => (
                  <div key={strategy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`coping-${strategy}`}
                      checked={formData.copingStrategies.includes(strategy)}
                      onCheckedChange={() => handleCopingToggle(strategy)}
                    />
                    <Label htmlFor={`coping-${strategy}`} className="text-sm cursor-pointer">
                      {strategy}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-lg">Additional notes or reflections</Label>
              <Textarea
                placeholder="How did today go? What are you grateful for? Any insights or goals for tomorrow?"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              size="lg"
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : existingCheckIn ? "Update Check-in" : "Complete Check-in"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Your check-in data helps track patterns and progress in your recovery journey.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyCheckIn;