import OpenAI from 'openai';

// Singleton client
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _client;
}

export const AI_CATEGORIES = [
  'AI', 'Software Engineering', 'Backend', 'Frontend',
  'Next.js', 'Automation', 'DevOps', 'Machine Learning',
  'Database', 'Security', 'Career', 'General',
] as const;

export type AICategory = typeof AI_CATEGORIES[number];

// ─── READING TIME ──────────────────────────────────────────
export function calcReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── SAFE JSON PARSE ───────────────────────────────────────
function safeJSON<T>(text: string, fallback: T): T {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
}

// ─── AI SUMMARY ────────────────────────────────────────────
export async function generateSummary(
  content: string,
  maxLength = 200
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return content.slice(0, maxLength) + '...';
  try {
    const ai = getClient();
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 80,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `You are a technical writer. Write a single clear sentence (max ${maxLength} chars) summarising the key insight of this developer post. No fluff. No "This post...". Start with an action verb or key concept.`,
        },
        { role: 'user', content: content.slice(0, 2000) },
      ],
    });
    return res.choices[0]?.message?.content?.trim() ?? content.slice(0, maxLength);
  } catch (e) {
    console.error('[AI] summary error:', e);
    return content.slice(0, maxLength) + '...';
  }
}

// ─── AI TAGS ───────────────────────────────────────────────
export async function generateTags(content: string): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) return extractBasicTags(content);
  try {
    const ai = getClient();
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 60,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'Return a JSON array of 3-6 short technical tags for this developer content. Prefer: tech names, concepts, frameworks. Return ONLY the JSON array, no explanation.',
        },
        { role: 'user', content: content.slice(0, 1500) },
      ],
    });
    const raw = res.choices[0]?.message?.content?.trim() ?? '[]';
    const tags = safeJSON<string[]>(raw, []);
    return Array.isArray(tags) ? tags.slice(0, 6) : extractBasicTags(content);
  } catch (e) {
    console.error('[AI] tags error:', e);
    return extractBasicTags(content);
  }
}

// ─── AI CATEGORY ───────────────────────────────────────────
export async function detectCategory(content: string): Promise<AICategory> {
  if (!process.env.OPENAI_API_KEY) return detectBasicCategory(content);
  try {
    const ai = getClient();
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 20,
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `Classify this developer post into exactly one category from this list: ${AI_CATEGORIES.join(', ')}. Return ONLY the category name, nothing else.`,
        },
        { role: 'user', content: content.slice(0, 1000) },
      ],
    });
    const cat = res.choices[0]?.message?.content?.trim() ?? '';
    return (AI_CATEGORIES as readonly string[]).includes(cat)
      ? (cat as AICategory)
      : detectBasicCategory(content);
  } catch (e) {
    console.error('[AI] category error:', e);
    return detectBasicCategory(content);
  }
}

// ─── AI SEO DESCRIPTION ────────────────────────────────────
export async function generateSEODescription(
  title: string,
  content: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return content.slice(0, 155);
  try {
    const ai = getClient();
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 60,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'Write an SEO meta description (max 155 chars) for this blog post. Be specific, include keywords, compelling but accurate.',
        },
        { role: 'user', content: `Title: ${title}\n\n${content.slice(0, 1000)}` },
      ],
    });
    const desc = res.choices[0]?.message?.content?.trim() ?? '';
    return desc.slice(0, 155) || content.slice(0, 155);
  } catch (e) {
    console.error('[AI] SEO desc error:', e);
    return content.slice(0, 155);
  }
}

// ─── BATCH ENRICH (all-in-one for webhook) ─────────────────
export interface AIEnrichment {
  ai_summary: string;
  ai_tags: string[];
  ai_category: AICategory;
  ai_seo_desc: string;
  reading_time: number;
}

export async function enrichContent(
  title: string,
  content: string
): Promise<AIEnrichment> {
  const reading_time = calcReadingTime(content);

  if (!process.env.OPENAI_API_KEY) {
    return {
      ai_summary: content.slice(0, 200),
      ai_tags: extractBasicTags(content),
      ai_category: detectBasicCategory(content),
      ai_seo_desc: content.slice(0, 155),
      reading_time,
    };
  }

  try {
    // Single batched call — more efficient than 4 separate calls
    const ai = getClient();
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 250,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are an AI enrichment engine for a developer portfolio. Given content, return ONLY a JSON object with these exact keys:
- summary: string (1 sentence, max 200 chars, start with verb/concept)
- tags: string[] (3-6 technical tags)
- category: one of [${AI_CATEGORIES.join(', ')}]
- seo_desc: string (max 155 chars, SEO meta description)
Return ONLY valid JSON, no markdown, no explanation.`,
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${content.slice(0, 2000)}`,
        },
      ],
    });
    const raw = res.choices[0]?.message?.content?.trim() ?? '{}';
    const parsed = safeJSON<any>(raw, {});
    return {
      ai_summary: parsed.summary ?? content.slice(0, 200),
      ai_tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : extractBasicTags(content),
      ai_category: (AI_CATEGORIES as readonly string[]).includes(parsed.category)
        ? parsed.category
        : detectBasicCategory(content),
      ai_seo_desc: parsed.seo_desc?.slice(0, 155) ?? content.slice(0, 155),
      reading_time,
    };
  } catch (e) {
    console.error('[AI] batch enrichment error:', e);
    return {
      ai_summary: content.slice(0, 200),
      ai_tags: extractBasicTags(content),
      ai_category: detectBasicCategory(content),
      ai_seo_desc: content.slice(0, 155),
      reading_time,
    };
  }
}

// ─── FALLBACKS (no API key) ────────────────────────────────
const TECH_KEYWORDS: Record<string, string[]> = {
  'Next.js':    ['next.js', 'nextjs', 'next js'],
  'React':      ['react', 'jsx', 'hooks', 'useState'],
  'Laravel':    ['laravel', 'artisan', 'eloquent'],
  'PHP':        ['php'],
  'TypeScript': ['typescript', 'ts', 'type'],
  'Docker':     ['docker', 'container', 'kubernetes', 'k8s'],
  'AWS':        ['aws', 'lambda', 's3', 'ec2', 'cloudfront'],
  'AI':         ['openai', 'gpt', 'llm', 'ai ', 'machine learning', 'ml'],
  'SQL':        ['sql', 'postgres', 'mysql', 'database', 'supabase'],
  'Redis':      ['redis', 'cache', 'queue'],
  'API':        ['api', 'rest', 'graphql', 'webhook'],
  'SEO':        ['seo', 'search engine', 'google ranking'],
};

function extractBasicTags(content: string): string[] {
  const lower = content.toLowerCase();
  const found: string[] = [];
  for (const [tag, keywords] of Object.entries(TECH_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) found.push(tag);
    if (found.length >= 5) break;
  }
  return found.length > 0 ? found : ['Development'];
}

function detectBasicCategory(content: string): AICategory {
  const lower = content.toLowerCase();
  if (/openai|gpt|llm|ai |machine learning/.test(lower)) return 'AI';
  if (/docker|kubernetes|aws|devops|ci\/cd|deploy/.test(lower)) return 'DevOps';
  if (/next\.?js|react|vue|tailwind|frontend/.test(lower)) return 'Frontend';
  if (/laravel|php|node|express|api|backend|server/.test(lower)) return 'Backend';
  if (/automat|workflow|n8n|zapier/.test(lower)) return 'Automation';
  if (/sql|database|postgres|supabase|prisma/.test(lower)) return 'Database';
  return 'Software Engineering';
}
