alter table cms_assets
  add column if not exists caption_text text not null default '',
  add column if not exists caption_position text not null default 'bottom-right',
  add column if not exists caption_color text not null default '#ffffff';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cms_assets_caption_text_length'
  ) then
    alter table cms_assets
      add constraint cms_assets_caption_text_length check (char_length(caption_text) <= 500);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'cms_assets_caption_position'
  ) then
    alter table cms_assets
      add constraint cms_assets_caption_position check (caption_position in ('bottom-left', 'bottom-right'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'cms_assets_caption_color'
  ) then
    alter table cms_assets
      add constraint cms_assets_caption_color check (caption_color ~ '^#[0-9a-fA-F]{6}$');
  end if;
end $$;