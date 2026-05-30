-- PostgreSQL schema for a database-backed Gaokao volunteer advisor.
-- This schema is intentionally generic and does not include real admission data.

create table if not exists schools (
  id bigserial primary key,
  name text not null,
  province text,
  city text,
  nature text check (nature in ('公办', '民办', '中外合作', '其他')),
  level text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  unique (name, province)
);

create table if not exists majors (
  id bigserial primary key,
  school_id bigint references schools(id) on delete cascade,
  name text not null,
  major_code text,
  category text,
  degree_years text,
  tuition integer,
  requirements text,
  unique (school_id, name, major_code)
);

create table if not exists admission_records (
  id bigserial primary key,
  year integer not null,
  province text not null,
  subject text not null check (subject in ('history', 'physics', 'arts', 'science')),
  batch text not null,
  school_id bigint references schools(id) on delete cascade,
  major_id bigint references majors(id) on delete set null,
  min_score integer,
  min_rank integer,
  plan_count integer,
  admit_count integer,
  source text,
  source_hash text,
  created_at timestamptz default now()
);

create index if not exists idx_admission_query
  on admission_records (province, year, subject, batch, min_score, min_rank);

create index if not exists idx_admission_school
  on admission_records (school_id, major_id);

create table if not exists rank_segments (
  id bigserial primary key,
  year integer not null,
  province text not null,
  subject text not null,
  score integer not null,
  rank integer not null,
  same_score_count integer,
  unique (year, province, subject, score)
);

create table if not exists recommendation_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  score integer,
  rank integer,
  subject text,
  region_preference text,
  interests text[],
  career_goal text,
  result_count integer
);

create table if not exists access_codes (
  code_hash text primary key,
  plan text not null default 'trial',
  expires_at timestamptz,
  daily_ai_limit integer default 20,
  created_at timestamptz default now()
);

create table if not exists ai_usage_logs (
  id bigserial primary key,
  access_code_hash text references access_codes(code_hash),
  created_at timestamptz default now(),
  model text,
  prompt_tokens integer,
  completion_tokens integer,
  status text
);
