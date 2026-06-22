-- db/migration_portfolio.sql
-- Run once against your Neon DB to create all tables.
-- After running this, run migration_portfolio_realworld_seed.sql for data.
-- ──────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── projects ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT        NOT NULL UNIQUE,
  title               TEXT        NOT NULL,
  subtitle            TEXT,
  description         TEXT,
  long_description    TEXT,
  category            TEXT        NOT NULL DEFAULT 'web-app',
  stack               TEXT[]      NOT NULL DEFAULT '{}',
  tags                TEXT[]      DEFAULT '{}',
  thumbnail_url       TEXT,
  video_url           TEXT,
  live_url            TEXT,
  github_url          TEXT,

  -- Narrative framework
  problem_statement   TEXT,
  approach            TEXT,
  process_notes       TEXT,
  learnings           TEXT[]      DEFAULT '{}',
  artifact_urls       TEXT[]      DEFAULT '{}',

  -- ROI Receipt
  roi_label           TEXT,
  roi_value           TEXT,
  roi_context         TEXT,

  -- Vouch system
  testimonial_quote   TEXT,
  testimonial_author  TEXT,
  testimonial_avatar  TEXT,

  -- Meta
  status              TEXT        NOT NULL DEFAULT 'published',
  featured            BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order          INTEGER     NOT NULL DEFAULT 0,
  built_at            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── certificates ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  issuer          TEXT        NOT NULL,
  issuer_logo_url TEXT,
  category        TEXT        NOT NULL DEFAULT 'cloud',
  credential_url  TEXT,
  badge_url       TEXT,
  issued_at       TIMESTAMPTZ NOT NULL,
  expires_at      TIMESTAMPTZ,
  credential_id   TEXT,
  roi_proof       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── metrics ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS metrics (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  label          TEXT        NOT NULL,
  value          NUMERIC     NOT NULL,
  unit           TEXT        NOT NULL DEFAULT 'count',
  display_value  TEXT,
  context        TEXT,
  icon           TEXT,
  period         TEXT        NOT NULL DEFAULT 'all-time',
  display_order  INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── activity_log ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT        NOT NULL,
  description TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── project_intakes (contact form) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_intakes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  project_type TEXT,
  budget       TEXT,
  timeline     TEXT,
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
