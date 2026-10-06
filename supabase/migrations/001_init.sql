create table lanterns (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  worry_kind  text not null check (worry_kind in (
                'greed_impatience','wavering_temptation',
                'relationship_anger','selfblame_lethargy',
                'anxiety_worry','overthinking','career_direction','unsure'))
);

alter table lanterns enable row level security;
create policy "lanterns insert" on lanterns for insert with check (true);
create policy "lanterns select" on lanterns for select using (true);

alter publication supabase_realtime add table lanterns;
