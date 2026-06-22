// types/portfolio.ts

// ── projects table ────────────────────────────────────────────────────────────
export interface Project {
  id:                 string;
  slug:               string;
  title:              string;
  subtitle:           string | null;
  description:        string;
  long_description:   string | null;
  category:           string;
  stack:              string[];
  tags:               string[];
  thumbnail_url:      string | null;
  video_url:          string | null;
  live_url:           string | null;
  github_url:         string | null;

  // ── Narrative framework (Problem → Impact) ───────────────────────────────
  problem_statement:  string | null;
  approach:           string | null;
  process_notes:      string | null;
  learnings:          string[] | null;
  artifact_urls:      string[] | null;

  // ── ROI receipt ───────────────────────────────────────────────────────────
  roi_label:          string | null;
  roi_value:          string | null;
  roi_context:        string | null;

  // ── Vouch / social proof ──────────────────────────────────────────────────
  testimonial_quote:  string | null;
  testimonial_author: string | null;
  testimonial_avatar: string | null;

  featured:    boolean;
  sort_order:  number;
  built_at:    string | null;
  created_at:  string;
}

// ── ProjectSummary — fat shape for the detail panel ──────────────────────────
export type ProjectSummary = Pick<
  Project,
  | 'id' | 'slug' | 'title' | 'subtitle'
  | 'category' | 'stack' | 'tags'
  | 'thumbnail_url' | 'live_url' | 'github_url'
  | 'roi_label' | 'roi_value' | 'roi_context'
  | 'testimonial_quote' | 'testimonial_author' | 'testimonial_avatar'
  | 'problem_statement' | 'approach' | 'process_notes' | 'learnings' | 'artifact_urls'
  | 'featured' | 'built_at'
>;

// ── certificates table ────────────────────────────────────────────────────────
export interface Certificate {
  id:              string;
  title:           string;
  issuer:          string;
  issuer_logo_url: string | null;
  category:        string;
  credential_url:  string | null;
  badge_url:       string | null;
  issued_at:       string;
  expires_at:      string | null;
  credential_id:   string | null;
  roi_proof:       string | null;
  created_at:      string;
}

// ── metrics table ─────────────────────────────────────────────────────────────
export interface Metric {
  id:            string;
  label:         string;
  value:         number;
  unit:          string;
  display_value: string | null;
  context:       string | null;
  icon:          string | null;
  period:        string;
  display_order: number;
}

// ── activity_log table ────────────────────────────────────────────────────────
export interface ActivityEntry {
  id:          string;
  event_type:  string;
  description: string;
  created_at:  string;
}

// ── Data loading state ────────────────────────────────────────────────────────
export type LoadStatus = 'loading' | 'error' | 'success';

export interface DataState {
  status: LoadStatus;
  error?: string;
}

// ── Aggregate shape: DesktopCanvas → window components ───────────────────────
export interface PortfolioData {
  projects:     ProjectSummary[];
  certificates: Certificate[];
  metrics:      Metric[];
}
