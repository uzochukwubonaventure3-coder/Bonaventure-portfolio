import { NextRequest } from 'next/server';
import { getRecentCommits, getActiveRepos, getCurrentTechnologies, getContribStats } from '@/lib/github/client';
import { ok, err } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'all';

  try {
    if (type === 'commits')  return ok(await getRecentCommits(10));
    if (type === 'repos')    return ok(await getActiveRepos(6));
    if (type === 'techs')    return ok(await getCurrentTechnologies());
    if (type === 'stats')    return ok(await getContribStats());

    // Combined feed
    const [commits, repos, techs, stats] = await Promise.all([
      getRecentCommits(8),
      getActiveRepos(4),
      getCurrentTechnologies(),
      getContribStats(),
    ]);
    return ok({ commits, repos, techs, stats });
  } catch (e: any) {
    return err(e.message ?? 'GitHub fetch failed', 500);
  }
}
