-- 月白 TSUKIYO — music playlist
CREATE TABLE IF NOT EXISTS music (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text,
  album text,
  cover_url text,
  audio_url text NOT NULL,
  duration_seconds integer,
  sort integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS music_enabled_sort_idx ON music (enabled, sort);