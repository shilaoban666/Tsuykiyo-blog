-- 月白 TSUKIYO — imported article provenance
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_platform text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_views integer NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_likes integer NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source_comments integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS posts_source_url_idx ON posts (source_url) WHERE source_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS posts_source_platform_idx ON posts (source_platform);