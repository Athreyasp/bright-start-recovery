-- Re-secure RLS with Supabase auth and fix foreign keys to auth.users

-- PROFILES
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- DAILY CHECK INS
DROP POLICY IF EXISTS "Open access to daily_check_ins" ON public.daily_check_ins;
DROP POLICY IF EXISTS "Allow all operations on daily_check_ins" ON public.daily_check_ins;
ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own daily check-ins" ON public.daily_check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own daily check-ins" ON public.daily_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily check-ins" ON public.daily_check_ins FOR UPDATE USING (auth.uid() = user_id);

-- RISK ASSESSMENTS
DROP POLICY IF EXISTS "Open access to risk_assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Allow all operations on risk_assessments" ON public.risk_assessments;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own risk assessments" ON public.risk_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own risk assessments" ON public.risk_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STRESS ASSESSMENTS
DROP POLICY IF EXISTS "Open access to stress_assessments" ON public.stress_assessments;
DROP POLICY IF EXISTS "Allow all operations on stress_assessments" ON public.stress_assessments;
ALTER TABLE public.stress_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stress assessments" ON public.stress_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own stress assessments" ON public.stress_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stress assessments" ON public.stress_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stress assessments" ON public.stress_assessments FOR DELETE USING (auth.uid() = user_id);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Open access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow all operations on appointments" ON public.appointments;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);

-- CONSENT FORMS
DROP POLICY IF EXISTS "Open access to consent_forms" ON public.consent_forms;
DROP POLICY IF EXISTS "Allow all operations on consent_forms" ON public.consent_forms;
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own consent forms" ON public.consent_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own consent forms" ON public.consent_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own consent forms" ON public.consent_forms FOR UPDATE USING (auth.uid() = user_id);

-- CHAT MESSAGES
DROP POLICY IF EXISTS "Open access to chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON public.chat_messages;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add/repair FKs to auth.users(id) for user_id columns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_check_ins_user_id_fkey') THEN
    ALTER TABLE public.daily_check_ins
      ADD CONSTRAINT daily_check_ins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'risk_assessments_user_id_fkey') THEN
    ALTER TABLE public.risk_assessments
      ADD CONSTRAINT risk_assessments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stress_assessments_user_id_fkey') THEN
    ALTER TABLE public.stress_assessments
      ADD CONSTRAINT stress_assessments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'appointments_user_id_fkey') THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'consent_forms_user_id_fkey') THEN
    ALTER TABLE public.consent_forms
      ADD CONSTRAINT consent_forms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chat_messages_user_id_fkey') THEN
    ALTER TABLE public.chat_messages
      ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_fkey') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;