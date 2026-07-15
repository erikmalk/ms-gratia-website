create table if not exists cms_assets (
  filename text primary key,
  src text not null,
  alt_text text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  source_category text not null,
  media_type text not null check (media_type in ('image', 'video')),
  duration_seconds double precision,
  sha256 text unique,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms_categories (
  slug text primary key check (slug in ('celebrity', 'beauty', 'editorial', 'advertising', 'film', 'sfx')),
  title text not null,
  description text not null,
  display_order integer not null unique,
  cover_filename text not null references cms_assets(filename),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms_category_items (
  category_slug text not null references cms_categories(slug) on delete cascade,
  asset_filename text not null references cms_assets(filename) on delete cascade,
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (category_slug, asset_filename),
  unique (category_slug, position)
);

create index if not exists cms_category_items_order_idx on cms_category_items(category_slug, position);
create index if not exists cms_assets_archived_idx on cms_assets(archived_at);

create table if not exists cms_rate_limits (
  key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0)
);
