import type { Match } from '../data';
import { sportScoreMatches } from './sportscore';

export type SportsResult = {
  matches: Match[];
  source: 'api' | 'demo';
  error?: string;
  updatedAt: string;
  every: number;
};

export async function getMatches(
  sport: 'football' | 'basketball'
): Promise<SportsResult> {
  const every = Math.max(
    60,
    Number(process.env.SPORTS_REVALIDATE_SECONDS) || 120
  );

  const updatedAt = new Date().toISOString();

  try {
    const matches = await sportScoreMatches(sport, every);

    return {
      matches,
      source: 'api',
      updatedAt,
      every,
    };
  } catch (error) {
    return {
      matches: [],
      source: 'api',
      error:
        error instanceof Error
          ? error.message
          : 'Unable to load sports data.',
      updatedAt,
      every,
    };
  }
}