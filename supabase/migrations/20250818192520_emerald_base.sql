/*
  # Create Leads Table for Contact Form Submissions

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `name` (text, required) - Contact person's full name
      - `email` (text, required) - Contact email address
      - `company` (text, optional) - Company name if provided
      - `service` (text, optional) - Service interest selected from dropdown
      - `message` (text, required) - Lead's message or inquiry
      - `created_at` (timestamptz) - Timestamp when lead was submitted
      - `updated_at` (timestamptz) - Timestamp when lead was last updated

  2. Security
    - Enable RLS on `leads` table
    - Add policy for authenticated users to insert new leads
    - Add policy for authenticated users to view all leads (for admin access)

  3. Indexes
    - Add index on email for faster lookups
    - Add index on created_at for sorting leads by submission time
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  service text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for lead management
CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_service_idx ON leads(service);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();