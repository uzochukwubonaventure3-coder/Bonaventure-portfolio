-- ============================================================
-- BC PORTFOLIO — MIGRATION v2: Social Sync + Activity + SEO
-- Paste this in Supabase SQL Editor AFTER running migration.sql
-- ============================================================

-- ─── SOCIAL POSTS (Twitter + LinkedIn synced) ──────────────
CREATE TABLE IF NOT EXISTS social_posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Source
  platform         TEXT NOT NULL CHECK (platform IN ('twitter','linkedin')),
  external_id      TEXT NOT NULL,          -- tweet id / linkedin activity URN
  external_url     TEXT,

  -- Content
  content          TEXT NOT NULL DEFAULT '',
  media_urls       TEXT[] DEFAULT '{}',    -- image/video CDN URLs saved to Cloudinary
  media_ids        TEXT[] DEFAULT '{}',    -- Cloudinary public IDs

  -- AI-enriched
  ai_summary       TEXT,
  ai_tags          TEXT[] DEFAULT '{}',
  ai_category      TEXT,
  ai_seo_desc      TEXT,
  reading_time     INT DEFAULT 1,

  -- Engagement
  likes            INT DEFAULT 0,
  reposts          INT DEFAULT 0,
  replies          INT DEFAULT 0,
  impressions      INT DEFAULT 0,

  -- Status
  synced_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at     TIMESTAMPTZ,
  raw_payload      JSONB,                  -- full original webhook payload

  -- Control
  featured         BOOLEAN DEFAULT false,
  hidden           BOOLEAN DEFAULT false,  -- admin can hide individual posts
  retry_count      INT DEFAULT 0,
  last_error       TEXT,

  UNIQUE (platform, external_id)           -- duplicate prevention
);

CREATE INDEX IF NOT EXISTS sp_platform_idx    ON social_posts (platform);
CREATE INDEX IF NOT EXISTS sp_published_idx   ON social_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS sp_category_idx    ON social_posts (ai_category);
CREATE INDEX IF NOT EXISTS sp_tags_idx        ON social_posts USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS sp_ext_id_idx      ON social_posts (platform, external_id);

-- ─── GITHUB ACTIVITY ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS github_activity (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type   TEXT NOT NULL,   -- push, pr, release, star, etc.
  repo_name    TEXT NOT NULL,
  repo_url     TEXT,
  branch       TEXT,
  message      TEXT,            -- commit message or PR title
  sha          TEXT,
  files_changed INT DEFAULT 0,
  additions    INT DEFAULT 0,
  deletions    INT DEFAULT 0,
  external_id  TEXT UNIQUE,     -- github event id
  committed_at TIMESTAMPTZ,
  raw_payload  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ga_type_idx  ON github_activity (event_type);
CREATE INDEX IF NOT EXISTS ga_time_idx  ON github_activity (committed_at DESC);

-- ─── WEBHOOK LOGS (audit / retry) ──────────────────────────
CREATE TABLE IF NOT EXISTS webhook_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform   TEXT NOT NULL,
  event_id   TEXT,
  status     TEXT NOT NULL CHECK (status IN ('received','processed','failed','duplicate','skipped')),
  payload    JSONB,
  error      TEXT,
  attempts   INT DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wl_platform_idx ON webhook_logs (platform);
CREATE INDEX IF NOT EXISTS wl_status_idx   ON webhook_logs (status);
CREATE INDEX IF NOT EXISTS wl_time_idx     ON webhook_logs (created_at DESC);

-- ─── AI PROCESSING QUEUE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_queue (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id  UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('post','social_post','project')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','done','failed')),
  attempts     INT DEFAULT 0,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS aq_status_idx ON ai_queue (status);

-- ─── RLS for new tables ────────────────────────────────────
ALTER TABLE social_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_queue        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read social_posts"    ON social_posts    FOR SELECT USING (hidden = false);
CREATE POLICY "Public read github_activity" ON github_activity FOR SELECT USING (true);

-- ─── FUNCTION: upsert social post (idempotent) ─────────────
CREATE OR REPLACE FUNCTION upsert_social_post(
  p_platform     TEXT,
  p_external_id  TEXT,
  p_content      TEXT,
  p_external_url TEXT DEFAULT NULL,
  p_media_urls   TEXT[] DEFAULT '{}',
  p_likes        INT DEFAULT 0,
  p_reposts      INT DEFAULT 0,
  p_replies      INT DEFAULT 0,
  p_impressions  INT DEFAULT 0,
  p_published_at TIMESTAMPTZ DEFAULT NOW(),
  p_raw_payload  JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO social_posts (
    platform, external_id, content, external_url,
    media_urls, likes, reposts, replies, impressions,
    published_at, raw_payload
  ) VALUES (
    p_platform, p_external_id, p_content, p_external_url,
    p_media_urls, p_likes, p_reposts, p_replies, p_impressions,
    p_published_at, p_raw_payload
  )
  ON CONFLICT (platform, external_id) DO UPDATE SET
    likes        = EXCLUDED.likes,
    reposts      = EXCLUDED.reposts,
    replies      = EXCLUDED.replies,
    impressions  = EXCLUDED.impressions,
    media_urls   = EXCLUDED.media_urls,
    raw_payload  = EXCLUDED.raw_payload
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ─── TECH SKILLS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS tech_skills (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name     TEXT NOT NULL,
  icon     TEXT NOT NULL DEFAULT '⚡',
  category TEXT NOT NULL CHECK (category IN ('FRONTEND','BACKEND','MOBILE','DATABASE','DEVOPS','TOOLS')),
  "order"  INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ts_category_idx ON tech_skills (category);
CREATE INDEX IF NOT EXISTS ts_order_idx    ON tech_skills ("order");

ALTER TABLE tech_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tech_skills" ON tech_skills FOR SELECT USING (true);

-- Seed default tech stack
INSERT INTO tech_skills (name, icon, category, "order") VALUES
  ('Vue.js',        '🟢', 'FRONTEND', 1),
  ('Tailwind CSS',  '🎨', 'FRONTEND', 2),
  ('React',         '⚛️', 'FRONTEND', 3),
  ('Next.js',       '▲',  'FRONTEND', 4),
  ('TypeScript',    '🔷', 'FRONTEND', 5),
  ('Framer Motion', '🎞', 'FRONTEND', 6),
  ('Figma',         '🎯', 'FRONTEND', 7),
  ('WordPress',     '🔵', 'FRONTEND', 8),
  ('Laravel',       '🔴', 'BACKEND',  1),
  ('PHP',           '🐘', 'BACKEND',  2),
  ('Java',          '☕', 'BACKEND',  3),
  ('Node.js',       '🟩', 'BACKEND',  4),
  ('React Native',  '📱', 'MOBILE',   1),
  ('Redis',         '🔴', 'DATABASE', 1),
  ('PostgreSQL',    '🐘', 'DATABASE', 2),
  ('MySQL',         '🐬', 'DATABASE', 3),
  ('MongoDB',       '🍃', 'DATABASE', 4),
  ('Git',           '🌿', 'DEVOPS',   1),
  ('GitHub Actions','⚙️', 'DEVOPS',   2),
  ('Docker',        '🐳', 'DEVOPS',   3),
  ('AWS',           '☁️', 'DEVOPS',   4),
  ('Linux',         '🐧', 'DEVOPS',   5),
  ('VS Code',       '💙', 'TOOLS',    1),
  ('Postman',       '🔶', 'TOOLS',    2),
  ('Notion',        '📝', 'TOOLS',    3)
ON CONFLICT DO NOTHING;
