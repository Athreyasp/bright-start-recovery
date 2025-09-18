-- Drop and recreate all RLS policies to work with Clerk auth (no auth.uid())
-- Since Clerk doesn't use Supabase auth, we need to remove auth.uid() dependencies

-- DAILY CHECK INS - Drop existing and create new
DROP POLICY IF EXISTS "Open access to daily_check_ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Users can create their own daily check-ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Users can update their own daily check-ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Users can view their own daily check-ins" ON public.daily_check_ins;
CREATE POLICY "Allow all operations on daily_check_ins"
ON public.daily_check_ins
FOR ALL
USING (true)
WITH CHECK (true);

-- RISK ASSESSMENTS - Drop existing and create new
DROP POLICY IF EXISTS "Open access to risk_assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can create their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;
CREATE POLICY "Allow all operations on risk_assessments"
ON public.risk_assessments
FOR ALL
USING (true)
WITH CHECK (true);

-- STRESS ASSESSMENTS - Drop existing and create new
DROP POLICY IF EXISTS "Open access to stress_assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can create their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can delete their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can update their own stress assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Users can view their own stress assessments" ON public.stress_assessments;
CREATE POLICY "Allow all operations on stress_assessments"
ON public.stress_assessments
FOR ALL
USING (true)
WITH CHECK (true);

-- APPOINTMENTS - Drop existing and create new
DROP POLICY IF EXISTS "Open access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Allow all operations on appointments"
ON public.appointments
FOR ALL
USING (true)
WITH CHECK (true);

-- CONSENT FORMS - Drop existing and create new
DROP POLICY IF EXISTS "Open access to consent_forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Users can create their own consent forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Users can update their own consent forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Users can view their own consent forms" ON public.consent_forms;
CREATE POLICY "Allow all operations on consent_forms"
ON public.consent_forms
FOR ALL
USING (true)
WITH CHECK (true);

-- CHAT MESSAGES - Drop existing and create new
DROP POLICY IF EXISTS "Open access to chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
CREATE POLICY "Allow all operations on chat_messages"
ON public.chat_messages
FOR ALL
USING (true)
WITH CHECK (true);