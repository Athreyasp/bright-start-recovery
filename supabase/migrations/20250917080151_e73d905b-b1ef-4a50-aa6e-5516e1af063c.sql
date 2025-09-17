-- Create stress_assessments table
CREATE TABLE public.stress_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stress_level INTEGER NOT NULL CHECK (stress_level >= 0 AND stress_level <= 10),
  sleep_hours DECIMAL(3,1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  exercise_frequency INTEGER NOT NULL CHECK (exercise_frequency >= 0 AND exercise_frequency <= 7),
  work_pressure INTEGER NOT NULL CHECK (work_pressure >= 0 AND work_pressure <= 10),
  relationship_stress INTEGER NOT NULL CHECK (relationship_stress >= 0 AND relationship_stress <= 10),
  financial_stress INTEGER NOT NULL CHECK (financial_stress >= 0 AND financial_stress <= 10),
  health_concerns INTEGER NOT NULL CHECK (health_concerns >= 0 AND health_concerns <= 10),
  social_support INTEGER NOT NULL CHECK (social_support >= 0 AND social_support <= 10),
  coping_mechanisms TEXT,
  stress_triggers TEXT,
  physical_symptoms TEXT[] DEFAULT '{}',
  emotional_symptoms TEXT[] DEFAULT '{}',
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  stress_category TEXT NOT NULL CHECK (stress_category IN ('Low Stress', 'Moderate Stress', 'High Stress')),
  recommendations TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stress_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own stress assessments" 
ON public.stress_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stress assessments" 
ON public.stress_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stress assessments" 
ON public.stress_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stress assessments" 
ON public.stress_assessments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stress_assessments_updated_at
BEFORE UPDATE ON public.stress_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_stress_assessments_user_id ON public.stress_assessments(user_id);
CREATE INDEX idx_stress_assessments_created_at ON public.stress_assessments(created_at DESC);