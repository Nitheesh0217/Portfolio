-- D Web Studios — Project Intakes Migration
-- Paste into Neon SQL Editor or run via psql

CREATE TABLE IF NOT EXISTS project_intakes (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL    DEFAULT now(),

  -- Step 1 — Project Basics
  project_name          TEXT        NOT NULL,
  project_type          TEXT        NOT NULL,
  timeline              TEXT,

  -- Step 2 — Business & Users
  business_name         TEXT,
  industry              TEXT,
  target_audience       TEXT,
  primary_goal          TEXT,
  user_personas         TEXT,

  -- Step 3 — User Stories & Features
  user_stories          TEXT,
  must_have_features    TEXT,
  nice_to_have_features TEXT,

  -- Step 4 — Technical Context
  existing_systems      TEXT,
  preferred_stack       TEXT,
  constraints           TEXT,

  -- Step 5 — Budget & Contact
  budget_range          TEXT,
  engagement_type       TEXT,
  client_name           TEXT,
  client_email          TEXT,
  client_company        TEXT,

  -- Metadata
  source                TEXT        NOT NULL    DEFAULT 'web_form',

  -- AI Scoping Results (populated asynchronously)
  ai_architecture       TEXT,
  ai_user_flows         TEXT,
  ai_scope_summary      TEXT
);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_project_intakes_created_at
  ON project_intakes (created_at DESC);
