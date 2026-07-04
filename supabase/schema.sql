-- ============================================================================
-- Supabase PostgreSQL Schema for Portfolio & Admin Dashboard
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  title text not null,
  biography text,
  profile_photo text,
  cover_photo text,
  resume_url text,
  phone text,
  email text,
  location text,
  social_links jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  technologies text[] default '{}'::text[],
  github_url text,
  live_url text,
  category text not null, -- e.g. Data Analytics, Machine Learning, Web Dev
  completion_date date,
  image_url text,
  images text[] default '{}'::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Skills Table
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- e.g. Programming, Web Development, Database, Data Analytics, AI & ML, Tools
  proficiency integer not null check (proficiency >= 0 and proficiency <= 100),
  icon_name text, -- name of the react-icons icon to render (e.g. SiPython, FaReact)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Certificates Table
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  organization text not null,
  issue_date date,
  credential_id text,
  verification_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Education Table
create table if not exists public.education (
  id uuid default gen_random_uuid() primary key,
  degree text not null,
  college text not null,
  university text,
  year text not null, -- e.g. "2021 - 2025"
  cgpa numeric check (cgpa >= 0.0 and cgpa <= 10.0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Gallery Table
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  name text,
  size integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Messages Table (Contact Form)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Settings Table
create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  logo_url text,
  meta_description text,
  google_analytics_id text,
  theme text default 'dark',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Visitor Logs Table
create table if not exists public.visitor_logs (
  id uuid default gen_random_uuid() primary key,
  ip_address text,
  user_agent text,
  page_visited text,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- Row Level Security (RLS) Configuration
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.certificates enable row level security;
alter table public.education enable row level security;
alter table public.gallery enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;
alter table public.visitor_logs enable row level security;

-- Policies for public tables (Read access to everyone, write access to authenticated users)

-- Profiles
create policy "Allow public read access on profiles" on public.profiles for select using (true);
create policy "Allow authenticated admin edit on profiles" on public.profiles for all using (auth.role() = 'authenticated');

-- Projects
create policy "Allow public read access on projects" on public.projects for select using (true);
create policy "Allow authenticated admin edit on projects" on public.projects for all using (auth.role() = 'authenticated');

-- Skills
create policy "Allow public read access on skills" on public.skills for select using (true);
create policy "Allow authenticated admin edit on skills" on public.skills for all using (auth.role() = 'authenticated');

-- Certificates
create policy "Allow public read access on certificates" on public.certificates for select using (true);
create policy "Allow authenticated admin edit on certificates" on public.certificates for all using (auth.role() = 'authenticated');

-- Education
create policy "Allow public read access on education" on public.education for select using (true);
create policy "Allow authenticated admin edit on education" on public.education for all using (auth.role() = 'authenticated');

-- Gallery
create policy "Allow public read access on gallery" on public.gallery for select using (true);
create policy "Allow authenticated admin edit on gallery" on public.gallery for all using (auth.role() = 'authenticated');

-- Settings
create policy "Allow public read access on settings" on public.settings for select using (true);
create policy "Allow authenticated admin edit on settings" on public.settings for all using (auth.role() = 'authenticated');

-- Messages (Anyone can insert to contact, only admin can view/edit)
create policy "Allow public message insertion" on public.messages for insert with check (true);
create policy "Allow authenticated admin edit on messages" on public.messages for all using (auth.role() = 'authenticated');

-- Visitor Logs (Anyone can insert log, only admin can view/edit)
create policy "Allow public log insertion" on public.visitor_logs for insert with check (true);
create policy "Allow authenticated admin edit on visitor_logs" on public.visitor_logs for all using (auth.role() = 'authenticated');

-- ============================================================================
-- Profile Setup Trigger (Auto-create profile row on user signup)
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, title, biography, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Portfolio Owner'),
    'Aspiring Data Analyst | AI & ML Enthusiast',
    'I am a passionate data analyst and AI/ML enthusiast focused on turning complex data into actionable insights.',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger logic (only run if trigger doesn't exist)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- Storage Buckets Setup
-- ============================================================================
-- Note: Supabase storage buckets must be created manually or via SQL.
-- Run these inserts to create the 'portfolio' storage bucket if using storage API.
insert into storage.buckets (id, name, public) 
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Storage policies for the 'portfolio' bucket (allowing public reading, admin writing)
create policy "Allow public read from portfolio bucket"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Allow authenticated uploads to portfolio bucket"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

create policy "Allow authenticated updates to portfolio bucket"
  on storage.objects for update
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

create policy "Allow authenticated deletes from portfolio bucket"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' and auth.role() = 'authenticated' );

-- ============================================================================
-- Seed Data
-- ============================================================================

-- Settings
insert into public.settings (id, title, meta_description, theme)
values (
  '8d5b8e9d-195b-4c0b-8d04-584a2eaeb922',
  'Portfolio & Admin Dashboard',
  'Professional Portfolio of an Aspiring Data Analyst, AI/ML Enthusiast, and Web Developer.',
  'dark'
) on conflict (id) do nothing;

-- Skills
insert into public.skills (name, category, proficiency, icon_name) values
-- Programming
('Python', 'Programming', 90, 'SiPython'),
('C', 'Programming', 75, 'SiC'),
('C++', 'Programming', 80, 'SiCplusplus'),
('Java', 'Programming', 70, 'DiJava'),
-- Web Development
('HTML5', 'Web Development', 95, 'SiHtml5'),
('CSS3', 'Web Development', 90, 'SiCss3'),
('JavaScript', 'Web Development', 85, 'SiJavascript'),
('React', 'Web Development', 80, 'FaReact'),
('Node.js', 'Web Development', 75, 'FaNodeJs'),
-- Database
('SQL', 'Database', 90, 'DiDatabase'),
('MySQL', 'Database', 85, 'SiMysql'),
('MongoDB', 'Database', 75, 'SiMongodb'),
('Supabase', 'Database', 80, 'SiSupabase'),
-- Data Analytics
('Excel', 'Data Analytics', 90, 'SiMicrosoftexcel'),
('Power BI', 'Data Analytics', 85, 'SiPowerbi'),
('Tableau', 'Data Analytics', 80, 'SiTableau'),
('Pandas', 'Data Analytics', 85, 'SiPandas'),
('NumPy', 'Data Analytics', 80, 'SiNumpy'),
('Matplotlib', 'Data Analytics', 75, 'SiMatplotlib'),
-- AI & Machine Learning
('Scikit-Learn', 'AI & Machine Learning', 80, 'SiScikitlearn'),
('TensorFlow', 'AI & Machine Learning', 75, 'SiTensorflow'),
('Machine Learning', 'AI & Machine Learning', 85, 'GiArtificialIntelligence'),
('Deep Learning', 'AI & Machine Learning', 70, 'GiBrain'),
-- Tools
('Git', 'Tools', 85, 'FaGitAlt'),
('GitHub', 'Tools', 90, 'FaGithub'),
('VS Code', 'Tools', 95, 'DiVisualstudio'),
('Postman', 'Tools', 80, 'SiPostman');

-- Education
insert into public.education (degree, college, university, year, cgpa) values
('Bachelor of Technology in Computer Science', 'Kalinga Institute of Industrial Technology', 'KIIT University', '2021 - 2025', 8.92),
('Higher Secondary Education (Class XII)', 'DAV Public School', 'CBSE', '2019 - 2021', 9.40);

-- Projects
insert into public.projects (title, description, technologies, github_url, live_url, category, completion_date, image_url) values
('Sales Performance Analytics Dashboard', 'A comprehensive Excel and Power BI project that processes raw retail data to track revenues, customer demographics, and product returns.', array['Excel', 'Power BI', 'SQL'], 'https://github.com/example/sales-dashboard', 'https://example.com/sales-dashboard-live', 'Data Analytics', '2025-11-20', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'),
('Heart Disease Prediction Model', 'Developed a binary classification model using Random Forest and XGBoost to predict heart disease risks based on patient clinical parameters.', array['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'], 'https://github.com/example/heart-disease-predict', 'https://example.com/heart-disease-model', 'AI & Machine Learning', '2026-02-15', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'),
('AI-Powered Code Assistant', 'Created a React web application integrated with an Express/Node backend that uses OpenAI LLM embeddings to suggest code optimizations.', array['React', 'Node.js', 'Express', 'Tailwind CSS', 'OpenAI'], 'https://github.com/example/ai-code-helper', 'https://example.com/ai-code-helper-live', 'Web Development', '2026-05-10', 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80');

-- Certificates
insert into public.certificates (name, organization, issue_date, credential_id, verification_url, image_url) values
('Google Data Analytics Professional Certificate', 'Coursera - Google', '2025-08-14', 'GDA-10928374', 'https://coursera.org/verify/gda10928374', 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80'),
('Machine Learning Specialization', 'Coursera - DeepLearning.AI', '2026-01-05', 'ML-98273641', 'https://coursera.org/verify/ml98273641', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');
