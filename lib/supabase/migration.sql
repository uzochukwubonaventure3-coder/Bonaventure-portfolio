-- ============================================================
-- BC PORTFOLIO — SUPABASE SQL MIGRATION
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ─── POSTS TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content       TEXT NOT NULL DEFAULT '',
  excerpt       TEXT,
  cover_image   TEXT,
  cover_image_id TEXT,
  tags          TEXT[] DEFAULT '{}',
  section       TEXT NOT NULL DEFAULT 'Latest Thoughts'
                  CHECK (section IN (
                    'Latest Thoughts',
                    'Building In Public',
                    'Engineering Notes',
                    'AI Experiments',
                    'What I''m Learning'
                  )),
  platform      TEXT NOT NULL DEFAULT 'self'
                  CHECK (platform IN ('self','twitter','linkedin','hashnode','devto','medium','github')),
  external_url  TEXT,
  reading_time  INT NOT NULL DEFAULT 1,
  ai_summary    TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT false,
  views         INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(content,'') || ' ' || COALESCE(excerpt,''))
);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS posts_section_idx ON posts (section);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published);
CREATE INDEX IF NOT EXISTS posts_featured_idx ON posts (featured);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);

-- ─── PROJECTS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  url           TEXT,
  date          TEXT,
  description   TEXT NOT NULL DEFAULT '',
  tags          TEXT[] DEFAULT '{}',
  categories    TEXT[] DEFAULT '{}',
  image_url     TEXT,
  image_id      TEXT,
  live_url      TEXT,
  github_url    TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT true,
  "order"       INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects (featured);
CREATE INDEX IF NOT EXISTS projects_order_idx ON projects ("order");

-- ─── EXPERIENCE TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title     TEXT NOT NULL,
  company   TEXT NOT NULL,
  type      TEXT NOT NULL,
  period    TEXT NOT NULL,
  badge     TEXT,
  initials  TEXT NOT NULL,
  color     TEXT NOT NULL DEFAULT '#F97316',
  tags      TEXT[] DEFAULT '{}',
  bullets   TEXT[] DEFAULT '{}',
  "order"   INT NOT NULL DEFAULT 0,
  current   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TESTIMONIALS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote       TEXT NOT NULL,
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  avatar_url  TEXT,
  avatar_id   TEXT,
  initials    TEXT NOT NULL,
  featured    BOOLEAN NOT NULL DEFAULT true,
  approved    BOOLEAN NOT NULL DEFAULT false,
  "order"     INT NOT NULL DEFAULT 999,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CONTACT MESSAGES TABLE ────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  budget     TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  replied    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SITE SETTINGS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ADMINS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admins (email, password, name) VALUES
  (
    'bonaventurechidalu@gmail.com',
    '$2a$12$Zj6N2KcjFUTNw7lw8mN9we3oQfo7.9dJU6YBZ8kDp/gkrE4qd2Hb2',
    'Bonaventure Chidalu'
  )
ON CONFLICT (email) DO NOTHING;

-- ─── FUNCTION: auto-update updated_at ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER posts_updated_at        BEFORE UPDATE ON posts        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER projects_updated_at     BEFORE UPDATE ON projects     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER experience_updated_at   BEFORE UPDATE ON experience   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER site_settings_updated   BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── FUNCTION: increment post views ────────────────────────
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts SET views = views + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ─── ROW LEVEL SECURITY (RLS) ──────────────────────────────
ALTER TABLE posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published posts"    ON posts        FOR SELECT USING (published = true);
CREATE POLICY "Public can read published projects" ON projects     FOR SELECT USING (published = true);
CREATE POLICY "Public can read experience"         ON experience   FOR SELECT USING (true);
CREATE POLICY "Public can read approved testimonials" ON testimonials FOR SELECT USING (approved = true AND featured = true);
CREATE POLICY "Public can read settings"           ON site_settings FOR SELECT USING (true);

-- Public can insert contact messages and testimonials
CREATE POLICY "Public can submit contact"          ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit testimonials"     ON testimonials FOR INSERT WITH CHECK (true);

-- Service role bypasses RLS (used by admin API)
-- No policy needed — service role key bypasses all policies

-- ─── SEED DATA ─────────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('hero_name',          'Bonaventure Chidalu'),
  ('hero_bio',           'Full-stack software engineer with experience in backend architecture, web development, and system scalability.'),
  ('hero_location',      'FCT Abuja, Nigeria'),
  ('stat_years',         '1.8+'),
  ('stat_projects',      '25+'),
  ('stat_users',         '55k+'),
  ('whatsapp',           '2349064779856'),
  ('email',              'bonaventurechidalu@gmail.com'),
  ('github',             'https://github.com/bonaventurechidalu'),
  ('linkedin',           'https://linkedin.com/in/bonaventurechidalu'),
  ('twitter',            'https://twitter.com/bonaventurechidalu'),
  ('available_for_work', 'true'),
  ('resume_url',         '')
ON CONFLICT (key) DO NOTHING;

-- Sample post
INSERT INTO posts (title, slug, content, excerpt, section, platform, tags, reading_time, featured, published, ai_summary) VALUES
  (
    'How I Built a Real-Time Tracking System with Laravel & WebSockets',
    'real-time-tracking-laravel-websockets',
    '## Overview\n\nReal-time features are one of the most requested capabilities in modern web applications...',
    'A deep dive into the architecture behind iTrust Rapid Logistics — how I handled real-time GPS updates.',
    'Engineering Notes',
    'self',
    ARRAY['Laravel', 'WebSockets', 'PHP', 'Redis'],
    8,
    true,
    true,
    'This post covers building a real-time logistics tracking system using Laravel Echo, Redis, and WebSockets with role-based dashboards.'
  ),
  (
    'SEO in 2026: What Actually Moves the Needle for Nigerian Businesses',
    'seo-2026-nigeria',
    '## The SEO Landscape\n\nAfter 6 months of intensive SEO work...',
    'After 6 months of SEO work for The Heritage Times, here are the strategies that drove 300% organic traffic growth.',
    'Building In Public',
    'self',
    ARRAY['SEO', 'Nigeria', 'Content Strategy', 'Google'],
    6,
    false,
    true,
    'Practical SEO strategies that drove 300% organic traffic for a Nigerian news platform, focusing on Core Web Vitals and local search.'
  ),
  (
    'Getting Remote Dev Jobs as a Nigerian Developer in 2026',
    'remote-jobs-nigerian-developer-2026',
    '## The Remote Job Market\n\nThe remote development job market has fundamentally shifted...',
    'Practical advice on portfolio building, interview prep, and the exact platforms I used to land remote opportunities.',
    'What I''m Learning',
    'self',
    ARRAY['Career', 'Remote Work', 'Nigeria', 'Job Hunt'],
    7,
    true,
    true,
    'A practical guide for Nigerian developers on landing remote jobs, covering portfolio tips, interview strategies, and the best platforms to use.'
  )
ON CONFLICT (slug) DO NOTHING;
