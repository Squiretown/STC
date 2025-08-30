/*
  # Add missing columns to leads table

  1. New Columns
    - `assigned_to` (text, nullable) - For tracking lead assignment
    - `status` (text, default 'New') - For tracking lead status
    - `source` (text, default 'Website Contact Form') - For tracking lead source

  2. Changes
    - Add indexes for performance on status and assigned_to columns
    - Set appropriate default values for new columns
*/

-- Add missing columns to leads table
DO $$
BEGIN
  -- Add assigned_to column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE leads ADD COLUMN assigned_to text;
  END IF;

  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'status'
  ) THEN
    ALTER TABLE leads ADD COLUMN status text DEFAULT 'New';
  END IF;

  -- Add source column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'source'
  ) THEN
    ALTER TABLE leads ADD COLUMN source text DEFAULT 'Website Contact Form';
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON leads (assigned_to);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source);