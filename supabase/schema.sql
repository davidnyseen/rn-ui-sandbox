-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- It creates the profiles table that stores each learner's progress and
-- keeps it locked down so a user can only ever read/write their own row.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  goal integer not null default 10,
  current_unit_index integer not null default 0,
  current_lesson_index integer not null default 0,
  streak integer not null default 0,
  xp integer not null default 0,
  last_active_date date,
  has_onboarded boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a blank profile row the moment someone signs up, so the app
-- never has to handle a "logged in but no profile yet" state.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- Real-course content, transcribed from public-domain Thai textbooks
-- (FSI Thai Basic Course, Essential Thai, สวัสดี) rather than invented.
-- Each lesson's step sequence (word intro cards, pronunciation rules,
-- translation-choice questions, sentence-order questions, speak-it
-- prompts) is stored as one JSONB blob — see src/courseTypes.ts for the
-- shape — since the content is authored/validated as a whole lesson at a
-- time (scripts/seedCourse.js), not queried step-by-step.
create table if not exists public.course_subjects (
  id text primary key,
  title text not null,
  roman text not null,
  description text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.course_lessons (
  id text primary key,
  subject_id text not null references public.course_subjects (id) on delete cascade,
  sort_order integer not null,
  title text not null,
  steps jsonb not null
);

create index if not exists course_lessons_subject_idx on public.course_lessons (subject_id, sort_order);

alter table public.course_subjects enable row level security;
alter table public.course_lessons enable row level security;

-- Course content isn't per-user data — it's the same curriculum for
-- everyone, so it's publicly readable (including anon, so the app can
-- show it before sign-in) and only ever written by the seed script using
-- the service-role key, which bypasses RLS.
drop policy if exists "Course content is publicly readable" on public.course_subjects;
create policy "Course content is publicly readable"
  on public.course_subjects for select
  using (true);

drop policy if exists "Course content is publicly readable" on public.course_lessons;
create policy "Course content is publicly readable"
  on public.course_lessons for select
  using (true);

-- Per-user progress through course_subjects, separate from the
-- profiles.current_unit_index/current_lesson_index frontier (which only
-- tracks the static, built-in UNITS path) so the two systems can't collide.
create table if not exists public.course_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text not null references public.course_subjects (id) on delete cascade,
  unlocked_lesson_index integer not null default 0,
  stars jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, subject_id)
);

alter table public.course_progress enable row level security;

drop policy if exists "Users can view their own course progress" on public.course_progress;
create policy "Users can view their own course progress"
  on public.course_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert their own course progress" on public.course_progress;
create policy "Users can upsert their own course progress"
  on public.course_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own course progress" on public.course_progress;
create policy "Users can update their own course progress"
  on public.course_progress for update
  using (auth.uid() = user_id);
