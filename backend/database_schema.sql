-- Pradarsh Database Schema for Supabase

-- 1. Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create a profile for new users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  short_description text not null,
  description text not null,
  category text not null,
  tech_stack text[] not null,
  github_url text,
  live_url text,
  thumbnail_url text,
  developer_id uuid references public.profiles(id) on delete cascade not null,
  visits_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone." on public.projects
  for select using (true);

create policy "Authenticated users can create projects." on public.projects
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own projects." on public.projects
  for update using (auth.uid() = developer_id);

create policy "Users can delete their own projects." on public.projects
  for delete using (auth.uid() = developer_id);


-- 3. Project Images Table
create table public.project_images (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.project_images enable row level security;

create policy "Project images are viewable by everyone." on public.project_images
  for select using (true);

create policy "Users can manage images for their projects." on public.project_images
  for all using (
    auth.uid() in (
      select developer_id from public.projects where id = project_images.project_id
    )
  );


-- 4. Comments Table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone." on public.comments
  for select using (true);

create policy "Authenticated users can create comments." on public.comments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can delete their own comments." on public.comments
  for delete using (auth.uid() = user_id);


-- 5. Storage Buckets Setup
insert into storage.buckets (id, name, public) values ('project-thumbnails', 'project-thumbnails', true);
insert into storage.buckets (id, name, public) values ('project-screenshots', 'project-screenshots', true);

-- Storage policies for project-thumbnails
create policy "Thumbnails are publicly accessible." on storage.objects
  for select using (bucket_id = 'project-thumbnails');

create policy "Authenticated users can upload thumbnails." on storage.objects
  for insert with check (bucket_id = 'project-thumbnails' and auth.role() = 'authenticated');

create policy "Users can update/delete their own thumbnails." on storage.objects
  for update using (bucket_id = 'project-thumbnails' and auth.uid() = owner);
create policy "Users can delete their own thumbnails." on storage.objects
  for delete using (bucket_id = 'project-thumbnails' and auth.uid() = owner);

-- Storage policies for project-screenshots
create policy "Screenshots are publicly accessible." on storage.objects
  for select using (bucket_id = 'project-screenshots');

create policy "Authenticated users can upload screenshots." on storage.objects
  for insert with check (bucket_id = 'project-screenshots' and auth.role() = 'authenticated');

create policy "Users can update/delete their own screenshots." on storage.objects
  for update using (bucket_id = 'project-screenshots' and auth.uid() = owner);
create policy "Users can delete their own screenshots." on storage.objects
  for delete using (bucket_id = 'project-screenshots' and auth.uid() = owner);
