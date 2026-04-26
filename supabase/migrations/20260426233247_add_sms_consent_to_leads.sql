/*
  # Add SMS consent columns to leads table

  ## Summary
  Adds TCPA/CTIA-compliant SMS opt-in tracking columns to the `leads` table.
  Required for Toll-Free Verification (TFV) approval. Stores the consent flag,
  timestamp, and exact disclosure text shown at opt-in time for audit purposes.

  ## New Columns on `leads`
  - `sms_consent` (boolean, NOT NULL, default false) — whether the user checked the SMS opt-in box
  - `sms_consent_at` (timestamptz, nullable) — UTC timestamp of when consent was given; null if no consent
  - `sms_consent_text` (text, nullable) — verbatim disclosure text the user agreed to; null if no consent

  ## Index
  - Partial index on `sms_consent_at DESC` filtered to `sms_consent = true` for efficient
    lookup of opted-in numbers.

  ## Notes
  1. Existing rows get sms_consent = false (no retroactive consent assumed)
  2. No RLS changes needed — existing lead policies cover these columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'sms_consent'
  ) THEN
    ALTER TABLE leads ADD COLUMN sms_consent boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'sms_consent_at'
  ) THEN
    ALTER TABLE leads ADD COLUMN sms_consent_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'sms_consent_text'
  ) THEN
    ALTER TABLE leads ADD COLUMN sms_consent_text text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS leads_sms_consent_at_idx
  ON leads (sms_consent_at DESC)
  WHERE sms_consent = true;
