const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'bonaventurechidalu';

type GHHeaders = Record<string, string>;

function ghHeaders(): GHHeaders {
  const h: GHHeaders = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'BC-Portfolio/2.0',
  };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function ghFetch(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: ghHeaders(),
    next: { revalidate: 300 }, // 5-min cache
  });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return res.json();
}

// ─── TYPES ─────────────────────────────────────────────────
export interface GHCommit {
  sha: string;
  message: string;
  repo: string;
  repoUrl: string;
  branch: string;
  additions: number;
  deletions: number;
  filesChanged: number;
  date: string;
  url: string;
}

export interface GHRepo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  topics: string[];
}

export interface GHEvent {
  id: string;
  type: string;
  repo: string;
  repoUrl: string;
  payload: any;
  createdAt: string;
}

// ─── RECENT COMMITS (across all public repos) ──────────────
export async function getRecentCommits(limit = 10): Promise<GHCommit[]> {
  try {
    const events = await ghFetch(`/users/${GITHUB_USERNAME}/events?per_page=50`);
    const pushEvents = (events as any[])
      .filter((e: any) => e.type === 'PushEvent')
      .slice(0, 20);

    const commits: GHCommit[] = [];
    for (const event of pushEvents) {
      const repoName = event.repo?.name ?? '';
      const branch = event.payload?.ref?.replace('refs/heads/', '') ?? 'main';
      for (const c of (event.payload?.commits ?? []).slice(0, 3)) {
        if (commits.length >= limit) break;
        commits.push({
          sha: c.sha?.slice(0, 7) ?? '',
          message: c.message?.split('\n')[0] ?? '',
          repo: repoName.split('/')[1] ?? repoName,
          repoUrl: `https://github.com/${repoName}`,
          branch,
          additions: 0,
          deletions: 0,
          filesChanged: 0,
          date: event.created_at ?? new Date().toISOString(),
          url: `https://github.com/${repoName}/commit/${c.sha}`,
        });
      }
      if (commits.length >= limit) break;
    }
    return commits;
  } catch (e) {
    console.error('[GitHub] commits error:', e);
    return [];
  }
}

// ─── ACTIVE REPOS ──────────────────────────────────────────
export async function getActiveRepos(limit = 6): Promise<GHRepo[]> {
  try {
    const repos = await ghFetch(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${limit}&type=public`
    );
    return (repos as any[]).map((r: any) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      language: r.language,
      updatedAt: r.updated_at,
      topics: r.topics ?? [],
    }));
  } catch (e) {
    console.error('[GitHub] repos error:', e);
    return [];
  }
}

// ─── RECENT EVENTS FEED ────────────────────────────────────
export async function getGitHubEvents(limit = 15): Promise<GHEvent[]> {
  try {
    const events = await ghFetch(`/users/${GITHUB_USERNAME}/events?per_page=${limit}`);
    return (events as any[]).slice(0, limit).map((e: any) => ({
      id: e.id,
      type: e.type,
      repo: e.repo?.name?.split('/')[1] ?? e.repo?.name ?? '',
      repoUrl: `https://github.com/${e.repo?.name}`,
      payload: e.payload,
      createdAt: e.created_at,
    }));
  } catch (e) {
    console.error('[GitHub] events error:', e);
    return [];
  }
}

// ─── CURRENT LANGUAGES (what I'm using lately) ─────────────
export async function getCurrentTechnologies(): Promise<string[]> {
  try {
    const repos = await getActiveRepos(12);
    const langs = repos
      .map(r => r.language)
      .filter((l): l is string => Boolean(l));
    const counts: Record<string, number> = {};
    for (const l of langs) counts[l] = (counts[l] ?? 0) + 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang]) => lang);
  } catch {
    return ['TypeScript', 'PHP', 'JavaScript'];
  }
}

// ─── CONTRIBUTION STATS ────────────────────────────────────
export async function getContribStats(): Promise<{ repos: number; commits: number; stars: number }> {
  try {
    const [repos, events] = await Promise.all([
      ghFetch(`/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`),
      ghFetch(`/users/${GITHUB_USERNAME}/events?per_page=100`),
    ]);
    const stars = (repos as any[]).reduce((sum: number, r: any) => sum + (r.stargazers_count ?? 0), 0);
    const commits = (events as any[]).filter((e: any) => e.type === 'PushEvent').length;
    return { repos: (repos as any[]).length, commits, stars };
  } catch {
    return { repos: 0, commits: 0, stars: 0 };
  }
}
