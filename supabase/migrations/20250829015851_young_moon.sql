/*
  # Fix RLS policy for leads table

  1. Security Updates
    - Drop existing "Anyone can insert leads" policy that's not working correctly
    - Create new policy that explicitly allows anonymous/public users to insert leads
    - Maintain existing policies for authenticated users (read, update, delete)

  2. Changes Made
    - Updated INSERT policy to properly allow public access
    - Ensured contact form submissions work for anonymous visitors
    - Maintained security for admin operations
*/

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;

-- Create a new policy that explicitly allows public/anonymous users to insert leads
CREATE POLICY "Public can insert new leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Verify other policies are still in place (these should already exist)
-- Just ensuring they're correctly configured

-- Allow authenticated users to read all leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Authenticated users can view all leads'
  ) THEN
    CREATE POLICY "Authenticated users can view all leads"
      ON leads
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Allow authenticated users to update leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Authenticated users can update leads'
  ) THEN
    CREATE POLICY "Authenticated users can update leads"
      ON leads
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Allow authenticated users to delete leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leads' 
    AND policyname = 'Authenticated users can delete leads'
  ) THEN
    CREATE POLICY "Authenticated users can delete leads"
      ON leads
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;