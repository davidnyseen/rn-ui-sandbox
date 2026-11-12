-- Tester feedback on lesson content (src/components/FeedbackBox.tsx, temporary — 2026-11-12).
-- Anyone using the app may add a note; nobody can read, change or delete notes through the API. Read them in the
-- Supabase dashboard / SQL: select * from content_feedback order by created_at desc;
create table if not exists public.content_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  lesson_id text not null,
  lesson_title text,
  step_index int,
  step_id text,
  step_type text,
  step_snapshot text,          -- the step as JSON, so the note can be matched even after content changes
  applies_everywhere boolean not null default false,
  note text not null check (char_length(note) between 1 and 4000),
  platform text
);

alter table public.content_feedback enable row level security;

drop policy if exists "anyone can add feedback" on public.content_feedback;
create policy "anyone can add feedback" on public.content_feedback
  for insert to anon, authenticated with check (true);

grant insert on public.content_feedback to anon, authenticated;
