-- Add missing columns to consent_forms table
ALTER TABLE public.consent_forms 
ADD COLUMN relationship text,
ADD COLUMN signature_data text;