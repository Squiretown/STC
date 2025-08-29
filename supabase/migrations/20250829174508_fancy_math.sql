/*
  # Fix RLS INSERT policy for leads table

  This migration fixes the Row Level Security policy that prevents
  anonymous users from submitting contact forms.

  1. Changes
    - Drop existing problematic INSERT policies for leads table
    - Create a new clear policy that allows anyone to insert new leads
    - Ensure anonymous users can submit contact forms without authentication

  2. Security
    - Anonymous users can only INSERT new leads (contact form submissions)
    - Authenticated users retain full CRUD access for admin dashboard
*/

-- Drop existing INSERT policies that may be causing conflicts
DROP POLICY IF EXISTS "Public can insert new leads" ON public.leads;
DROP POLICY IF EXISTS "public can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create a simple, clear policy that allows anonymous users to insert leads
CREATE POLICY "Allow anonymous lead insertion"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert leads (for admin use)
CREATE POLICY "Allow authenticated lead insertion"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);