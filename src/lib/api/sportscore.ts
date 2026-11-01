import type { Match } from '../data';

type SportScoreMatch = {
  home: string;
  away: string;
  home_logo?: string | null;
  away_logo?: string | null;
  home_score?: string | number | null;
  away_score?: string | number | null;
  status?: string | null;
  status_text?: string | null;
  time: string;
  competition?: string | null;
  url?: string | null;
};

type SportScoreResponse = {
  matches?: SportScoreMatch[];
};

function parseScore(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;

  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function normalizeStatus(match: SportScoreMatch): Match['status'] {
  const status = `${match.status ?? ''} ${match.status_text ?? ''}`.toLowerCase();

  if (/live|in.progress|playing/.test(status)) return 'live';

  if (/finished|complete|ended/.test(status)) return 'finished';

  if (/postponed|cancelled|canceled|abandoned/.test(status)) return 'other';

  if (/upcoming|scheduled|not.started|delayed|to.be.determined/.test(status)) {
    return 'upcoming';
  }

  return 'other';
}

export async function sportScoreMatches(
  sport: 'football' | 'basketball',
  revalidateSeconds: number
): Promise<Match[]> {
  const url = new URL('https://sportscore.com/api/widget/matches/');
  url.searchParams.set('sport', sport);
  url.searchParams.set('limit', '50');

  const response = await fetch(url.toString(), {
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`SportScore responded with ${response.status}`);
  }

  const data = (await response.json()) as SportScoreResponse;

  if (!Array.isArray(data.matches)) {
    throw new Error('SportScore returned an unexpected response.');
  }

  return data.matches.map((match, index) => ({
    id: `${sport}-${match.url || `${match.time}-${match.home}-${match.away}-${index}`}`,
    sport,
    league: match.competition || 'Unknown competition',
    home: match.home,
    away: match.away,
    homeLogo: match.home_logo || undefined,
    awayLogo: match.away_logo || undefined,
    homeScore: parseScore(match.home_score),
    awayScore: parseScore(match.away_score),
    kickoff: match.time,
    status: normalizeStatus(match),
    label: match.status_text || match.status || undefined,
    matchUrl: match.url
  ? new URL(match.url, 'https://sportscore.com').toString()
  : undefined,
  }));
}