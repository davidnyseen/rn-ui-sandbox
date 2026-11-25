-- Called every 3 days by .github/workflows/keep-backend-awake.yml so the free project never pauses
-- (it had paused by 2026-11-25 and the feedback box failed with "Couldn't save"). Applied 2026-11-25.
create or replace function public.ping() returns int language sql stable set search_path = '' as $$ select 1 $$;
revoke all on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
