create table records (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),   -- "n분 전" 표시용
  worry_kind  text not null check (worry_kind in (
                'greed_impatience',      -- 탐: 욕심·조급
                'wavering_temptation',   -- 탐: 흔들림·유혹
                'relationship_anger',    -- 진: 관계·분노
                'selfblame_lethargy',    -- 진: 자책·무기력
                'anxiety_worry',         -- 치: 불안·걱정
                'overthinking',          -- 치: 잡념·생각 과다
                'career_direction',      -- 치: 진로·방향
                'unsure'                 -- 잘 모르겠어요
              )),
  worry_text  text not null,
  tea         text not null,
  quote_id    text not null,
  quote_text  text not null,
  is_flagged  boolean not null default false     -- 위기 표현 감지 시 true, 기록 화면에서 숨김
);

alter table records enable row level security;
create policy "records insert" on records for insert with check (true);
create policy "records select" on records for select using (true);

alter publication supabase_realtime add table records;
