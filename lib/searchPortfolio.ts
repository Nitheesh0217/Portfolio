// lib/searchPortfolio.ts
// Full-text search across projects, certificates, metrics
import type { ProjectSummary, Certificate, Metric } from '@/types/portfolio';

export interface SearchResult {
  type: 'project' | 'certificate' | 'metric' | 'skill';
  id: string;
  title: string;
  subtitle?: string;
  relevance: number; // 0-1
  data: ProjectSummary | Certificate | Metric | string;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function calculateRelevance(text: string, query: string): number {
  const normalized = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  if (normalized === normalizedQuery) return 1.0; // Exact match
  if (normalized.startsWith(normalizedQuery)) return 0.8; // Starts with
  if (normalized.includes(normalizedQuery)) return 0.6; // Contains
  return 0; // No match
}

export function searchProjects(
  projects: ProjectSummary[],
  query: string,
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const p of projects) {
    let relevance = 0;

    // Title (highest)
    relevance = Math.max(relevance, calculateRelevance(p.title, query) * 1.0);

    // Subtitle
    if (p.subtitle) {
      relevance = Math.max(relevance, calculateRelevance(p.subtitle, query) * 0.8);
    }

    // Stack (tech keywords)
    if (p.stack?.length) {
      for (const tech of p.stack) {
        relevance = Math.max(relevance, calculateRelevance(tech, query) * 0.9);
      }
    }

    // Tags
    if (p.tags?.length) {
      for (const tag of p.tags) {
        relevance = Math.max(relevance, calculateRelevance(tag, query) * 0.7);
      }
    }

    // Description/problem statement
    if (p.problem_statement) {
      relevance = Math.max(relevance, calculateRelevance(p.problem_statement, query) * 0.5);
    }

    if (relevance > 0) {
      results.push({
        type: 'project',
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || undefined,
        relevance,
        data: p,
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

export function searchCertificates(
  certificates: Certificate[],
  query: string,
): SearchResult[] {
  const results: SearchResult[] = [];

  for (const c of certificates) {
    let relevance = 0;

    relevance = Math.max(relevance, calculateRelevance(c.title, query) * 1.0);
    relevance = Math.max(relevance, calculateRelevance(c.issuer, query) * 0.9);
    relevance = Math.max(relevance, calculateRelevance(c.category, query) * 0.8);

    if (relevance > 0) {
      results.push({
        type: 'certificate',
        id: c.id,
        title: c.title,
        subtitle: c.issuer,
        relevance,
        data: c,
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

export function searchSkills(
  projects: ProjectSummary[],
  query: string,
): SearchResult[] {
  const skillSet = new Set<string>();

  for (const p of projects) {
    if (p.stack?.length) {
      p.stack.forEach((s) => skillSet.add(s));
    }
  }

  const results: SearchResult[] = [];

  for (const skill of skillSet) {
    const relevance = calculateRelevance(skill, query);
    if (relevance > 0) {
      results.push({
        type: 'skill',
        id: skill,
        title: skill,
        relevance,
        data: skill,
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

export function searchAll(
  projects: ProjectSummary[],
  certificates: Certificate[],
  metrics: Metric[],
  query: string,
): SearchResult[] {
  if (!query.trim()) return [];

  const projectResults = searchProjects(projects, query);
  const certResults = searchCertificates(certificates, query);
  const skillResults = searchSkills(projects, query);

  return [...projectResults, ...certResults, ...skillResults]
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 20); // Limit to 20 results
}
