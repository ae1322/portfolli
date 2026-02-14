-- ============================================================
-- Career Portfolio & Forum Platform — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  linkedin TEXT,
  github TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CERTIFICATES
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROJECTS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  live_url TEXT,
  repo_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CATEGORIES (seeded)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

INSERT INTO categories (name) VALUES
  ('General'),
  ('Career Advice'),
  ('Technical Help'),
  ('Project Showcase'),
  ('Interview Prep');

-- 5. POSTS (forum)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. COMMENTS
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Certificates: anyone can read, only owner can CUD
CREATE POLICY "Public certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Owner insert certificates" ON certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update certificates" ON certificates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete certificates" ON certificates FOR DELETE USING (auth.uid() = user_id);

-- Projects: anyone can read, only owner can CUD
CREATE POLICY "Public projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Owner insert projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Posts: anyone can read, only owner can CUD
CREATE POLICY "Public posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Owner insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments: anyone can read, only owner can CUD
CREATE POLICY "Public comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Owner insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner update comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner delete comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Categories: anyone can read
CREATE POLICY "Public categories" ON categories FOR SELECT USING (true);

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET for certificates
-- ============================================================
-- Create a bucket called 'certificates' in the Supabase dashboard
-- with public access, or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true);
