/*
  # Add portfolio_projects table

  1. New Table
    - `portfolio_projects` — stores portfolio/work page project cards

  2. Columns
    - id (uuid, primary key)
    - created_at / updated_at (timestamps)
    - name (text, required) — project display name
    - tagline (text) — one-line hook shown under name
    - description (text) — 2-3 sentence description
    - category (text) — 'Web Platform' | 'AI / Automation' | 'FinTech' | 'Real Estate'
    - tags (text[]) — array of tag strings
    - url (text, nullable) — live URL
    - status (text, default 'live') — 'live' | 'in-development'
    - featured (boolean, default false) — show in featured section
    - sort_order (integer, default 0) — manual sort ordering
    - accent_color (text) — Tailwind bg class e.g. 'bg-blue-600'
    - accent_light (text) — Tailwind bg class e.g. 'bg-blue-50'
    - accent_text (text) — Tailwind text class e.g. 'text-blue-600'
    - icon_name (text) — lucide icon name e.g. 'DollarSign'

  3. RLS
    - Public can read (for Work page)
    - Authenticated can insert/update/delete (for admin)

  4. Seed data — pre-populated with known projects
*/

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  tagline text DEFAULT '',
  description text DEFAULT '',
  category text DEFAULT 'Web Platform',
  tags text[] DEFAULT '{}',
  url text,
  status text DEFAULT 'live',
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  accent_color text DEFAULT 'bg-blue-600',
  accent_light text DEFAULT 'bg-blue-50',
  accent_text text DEFAULT 'text-blue-600',
  icon_name text DEFAULT 'Globe'
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read portfolio projects"
  ON portfolio_projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can insert portfolio projects"
  ON portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated can update portfolio projects"
  ON portfolio_projects
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated can delete portfolio projects"
  ON portfolio_projects
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_sort_order ON portfolio_projects (sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_featured ON portfolio_projects (featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_status ON portfolio_projects (status);

CREATE OR REPLACE FUNCTION update_portfolio_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_projects_updated_at();

INSERT INTO portfolio_projects (name, tagline, description, category, tags, url, status, featured, sort_order, accent_color, accent_light, accent_text, icon_name) VALUES
(
  'Fondi Solutions',
  'Real estate investment funding, made simple.',
  'A full-service real estate investment platform offering fix-and-flip guidance, bridge funding, equity financing, and SBA loan advisory. Built to help investors move fast — with 2-hour average response times and 500+ successful projects funded.',
  'Real Estate',
  ARRAY['Real Estate', 'Funding', 'SBA Loans', 'Bridge Loans'],
  'https://www.fondi.org',
  'live',
  true,
  1,
  'bg-emerald-600',
  'bg-emerald-50',
  'text-emerald-600',
  'DollarSign'
),
(
  'ALMA',
  'Add your one-line description here.',
  'Describe what ALMA does, who it is for, and the problem it solves. What makes it different? What technology powers it?',
  'AI / Automation',
  ARRAY['AI', 'Automation'],
  NULL,
  'live',
  true,
  2,
  'bg-violet-600',
  'bg-violet-50',
  'text-violet-600',
  'Bot'
),
(
  'LMiCheck',
  'Add your one-line description here.',
  'Describe LMiCheck — what does it verify and who uses it?',
  'FinTech',
  ARRAY['FinTech', 'Compliance'],
  NULL,
  'live',
  true,
  3,
  'bg-blue-600',
  'bg-blue-50',
  'text-blue-600',
  'BarChart3'
),
(
  'Monte',
  'Add your one-line description here.',
  'Describe the Monte app and what it does.',
  'FinTech',
  ARRAY['FinTech', 'Analytics'],
  NULL,
  'live',
  false,
  4,
  'bg-amber-600',
  'bg-amber-50',
  'text-amber-600',
  'BarChart3'
);
