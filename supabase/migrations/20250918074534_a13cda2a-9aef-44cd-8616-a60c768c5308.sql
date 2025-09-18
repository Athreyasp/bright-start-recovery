-- Make RLS policies compatible with Clerk-only auth by removing auth.uid() dependencies
-- This opens access to these tables for now (development). Tighten later if needed.

-- DAILY CHECK INS
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own daily check-ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Users can update their own daily check-ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Users can view their own daily check-ins" ON public.daily_check_ins;
CREATE POLICY "Open access to daily_check_ins"
ON public.daily_check_ins
FOR ALL
USING (true)
WITH CHECK (true);

-- RISK ASSESSMENTS
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;
CREATE POLICY "Open access to risk_assessments"
ON public.risk_assessments
FOR ALL
USING (true)
WITH CHECK (true);

-- STRESS ASSESSMENTS
ALTER TABLE public.stress_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can delete their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can update their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can view their own stress assessments" ON public.stress_assessments;
CREATE POLICY "Open access to stress_assessments"
ON public.stress_assessments
FOR ALL
USING (true)
WITH CHECK (true);

-- APPOINTMENTS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Open access to appointments"
ON public.appointments
FOR ALL
USING (true)
WITH CHECK (true);

-- CONSENT FORMS
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own consent forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Users can update their own consent forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Users can view their own consent forms" ON public.consent_forms;
CREATE POLICY "Open access to consent_forms"
ON public.consent_forms
FOR ALL
USING (true)
WITH CHECK (true);

-- CHAT MESSAGES
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
CREATE POLICY "Open access to chat_messages"
ON public.chat_messages
FOR ALL
USING (true)
WITH CHECK (true);
