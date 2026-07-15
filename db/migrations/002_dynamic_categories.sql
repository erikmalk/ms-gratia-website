do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'cms_categories'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%slug%'
  loop
    execute format('alter table cms_categories drop constraint %I', constraint_name);
  end loop;
end $$;

alter table cms_categories
  add column if not exists archived_at timestamptz,
  add column if not exists is_home boolean not null default false;

create unique index if not exists cms_categories_home_idx
  on cms_categories (is_home)
  where is_home = true;

with inserted_home as (
  insert into cms_categories (
    slug, title, description, display_order, cover_filename, is_home
  )
  values (
    'home', 'Home', 'Images displayed on the homepage.',
    (select coalesce(max(display_order), 0) + 1 from cms_categories),
    'old-age-sculpt-profile.webp', true
  )
  on conflict (slug) do nothing
  returning slug
), home_seed(filename, position) as (
  values
    ('old-age-sculpt-profile.webp', 1),
    ('guardians-three-poster.webp', 2),
    ('emancipation-credit-poster.webp', 3)
)
insert into cms_category_items (category_slug, asset_filename, position)
select 'home', seed.filename, seed.position
from home_seed seed
join cms_assets asset on asset.filename = seed.filename and asset.archived_at is null
where exists (select 1 from inserted_home)
on conflict (category_slug, asset_filename) do nothing;

update cms_categories set is_home = true where slug = 'home';
