-- ==================== INVERSA DATABASE SETUP ====================
-- PostgreSQL Database Creation Script
-- Created for INVERSA Platform - Collaborative Creative Writing
-- ============================================================

-- ==================== 1. CREATE DATABASE ====================
CREATE DATABASE inversa_db
  WITH ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

-- Connect to the database
\c inversa_db;

-- ==================== 2. CREATE EXTENSIONS ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== 3. CREATE TABLES ====================

-- ==================== USERS TABLE ====================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  profile_image TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted ON users(deleted_at);

-- ==================== CATEGORIES TABLE ====================
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  text_color VARCHAR(7),
  bg_class VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== GENRES TABLE ====================
CREATE TABLE genres (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  text_color VARCHAR(7),
  bg_class VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== TEAMS TABLE ====================
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  background_image TEXT,
  initiator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_teams_initiator ON teams(initiator_id);
CREATE INDEX idx_teams_deleted ON teams(deleted_at);

-- ==================== PROJECTS TABLE ====================
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  initiator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES categories(id),
  genre_id VARCHAR(50) REFERENCES genres(id),
  is_team_project BOOLEAN DEFAULT FALSE,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  total_chapters INTEGER DEFAULT 0,
  has_published_chapters BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  hidden_at TIMESTAMP,
  background_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_projects_initiator ON projects(initiator_id);
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_genre ON projects(genre_id);
CREATE INDEX idx_projects_published ON projects(has_published_chapters);
CREATE INDEX idx_projects_hidden ON projects(hidden);
CREATE INDEX idx_projects_deleted ON projects(deleted_at);

-- ==================== CHAPTERS TABLE ====================
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  locked_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(project_id, chapter_number)
);

CREATE INDEX idx_chapters_project ON chapters(project_id);
CREATE INDEX idx_chapters_status ON chapters(status);
CREATE INDEX idx_chapters_locked_by ON chapters(locked_by);
CREATE INDEX idx_chapters_deleted ON chapters(deleted_at);

-- ==================== SECTIONS TABLE ====================
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'image')),
  content TEXT,
  image_url TEXT,
  caption TEXT,
  section_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sections_chapter ON sections(chapter_id);
CREATE INDEX idx_sections_order ON sections(chapter_id, section_order);

-- ==================== COMMENTS TABLE ====================
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  CHECK (
    (chapter_id IS NOT NULL AND idea_id IS NULL) OR
    (chapter_id IS NULL AND idea_id IS NOT NULL)
  )
);

CREATE INDEX idx_comments_chapter ON comments(chapter_id);
CREATE INDEX idx_comments_idea ON comments(idea_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_deleted ON comments(deleted_at);

-- ==================== TEAM_COLLABORATORS TABLE ====================
CREATE TABLE team_collaborators (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_collaborators_team ON team_collaborators(team_id);
CREATE INDEX idx_team_collaborators_user ON team_collaborators(user_id);
CREATE INDEX idx_team_collaborators_status ON team_collaborators(status);

-- ==================== PROJECT_COLLABORATORS TABLE ====================
CREATE TABLE project_collaborators (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('editor', 'reviewer', 'contributor')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  assigned_chapters TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_collaborators_project ON project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user ON project_collaborators(user_id);
CREATE INDEX idx_project_collaborators_status ON project_collaborators(status);

-- ==================== BRAINSTORMS TABLE ====================
CREATE TABLE brainstorms (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brainstorms_project ON brainstorms(project_id);

-- ==================== IDEAS TABLE ====================
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorms(id) ON DELETE CASCADE,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_ideas_brainstorm ON ideas(brainstorm_id);
CREATE INDEX idx_ideas_chapter ON ideas(chapter_id);
CREATE INDEX idx_ideas_deleted ON ideas(deleted_at);

-- ==================== TASKS TABLE ====================
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorms(id) ON DELETE CASCADE,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_tasks_brainstorm ON tasks(brainstorm_id);
CREATE INDEX idx_tasks_chapter ON tasks(chapter_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deleted ON tasks(deleted_at);

-- ==================== DISCUSSIONS TABLE ====================
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_discussions_brainstorm ON discussions(brainstorm_id);
CREATE INDEX idx_discussions_user ON discussions(user_id);
CREATE INDEX idx_discussions_deleted ON discussions(deleted_at);

-- ==================== NOTES TABLE ====================
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_notes_brainstorm ON notes(brainstorm_id);
CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_deleted ON notes(deleted_at);

-- ==================== CONTRIBUTIONS TABLE ====================
CREATE TABLE contributions (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('idea', 'task', 'discussion', 'note')),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contributions_brainstorm ON contributions(brainstorm_id);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_type ON contributions(type);

-- ==================== READING_HISTORY TABLE ====================
CREATE TABLE reading_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(user_id, project_id, chapter_id)
);

CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_project ON reading_history(project_id);
CREATE INDEX idx_reading_history_last_read ON reading_history(last_read_at);

-- ==================== PROJECT_FOLLOWS TABLE ====================
CREATE TABLE project_follows (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_project_follows_user ON project_follows(user_id);
CREATE INDEX idx_project_follows_project ON project_follows(project_id);

-- ==================== USER_FOLLOWERS TABLE ====================
CREATE TABLE user_followers (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX idx_user_followers_following ON user_followers(following_id);

-- ==================== TEAM_JOIN_REQUESTS TABLE ====================
CREATE TABLE team_join_requests (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_join_requests_team ON team_join_requests(team_id);
CREATE INDEX idx_team_join_requests_user ON team_join_requests(user_id);
CREATE INDEX idx_team_join_requests_status ON team_join_requests(status);

-- ==================== 4. INSERT SAMPLE DATA ====================

-- Insert Categories
INSERT INTO categories (id, name, description, color, text_color, bg_class) VALUES
('novel', 'Novel', 'Karya fiksi panjang dengan plot kompleks', '#818CF8', '#FFFFFF', 'bg-indigo-400'),
('cerpen', 'Cerpen', 'Cerita pendek dengan plot sederhana', '#E5E7EB', '#1E293B', 'bg-gray-200'),
('blog', 'Blog', 'Artikel atau tulisan blog', '#94A3B8', '#FFFFFF', 'bg-slate-400'),
('skenario', 'Skenario', 'Naskah untuk film atau drama', '#0F172A', '#E5E7EB', 'bg-slate-900'),
('fabel', 'Fabel', 'Cerita dengan pesan moral', '#020617', '#E5E7EB', 'bg-slate-950'),
('komedi', 'Naskah Komedi', 'Naskah dengan tujuan menghibur', '#818CF8', '#FFFFFF', 'bg-indigo-400'),
('character', 'Character', 'Pengembangan karakter dan profil', '#94A3B8', '#FFFFFF', 'bg-slate-400');

-- Insert Genres
INSERT INTO genres (id, name, description, color, text_color, bg_class) VALUES
('comedy', 'Comedy', 'Cerita yang menghibur dan lucu', '#FBBF24', '#1E293B', 'bg-amber-400'),
('horror', 'Horror', 'Cerita yang menakutkan dan misterius', '#EF4444', '#FFFFFF', 'bg-red-500'),
('action', 'Action', 'Cerita penuh aksi dan petualangan', '#F97316', '#FFFFFF', 'bg-orange-500'),
('crime', 'Crime', 'Cerita tentang kejahatan dan misteri', '#6366F1', '#FFFFFF', 'bg-indigo-500'),
('adventure', 'Adventure', 'Cerita petualangan dan eksplorasi', '#10B981', '#FFFFFF', 'bg-emerald-500'),
('scifi', 'Sci-Fi', 'Cerita fiksi ilmiah dan futuristik', '#06B6D4', '#FFFFFF', 'bg-cyan-500'),
('romance', 'Romance', 'Cerita cinta dan hubungan', '#EC4899', '#FFFFFF', 'bg-pink-500'),
('documentary', 'Documentary', 'Cerita faktual dan dokumenter', '#8B5CF6', '#FFFFFF', 'bg-violet-500');

-- ==================== 5. CREATE VIEWS ====================

-- View: Active Users
CREATE VIEW active_users AS
SELECT id, name, email, role, created_at
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- View: Published Projects
CREATE VIEW published_projects AS
SELECT p.id, p.title, p.description, p.initiator_id, p.views, p.likes, p.created_at
FROM projects p
WHERE p.has_published_chapters = TRUE 
  AND p.hidden = FALSE 
  AND p.deleted_at IS NULL
ORDER BY p.views DESC;

-- View: User Project Count
CREATE VIEW user_project_count AS
SELECT 
  u.id,
  u.name,
  COUNT(p.id) as project_count,
  COUNT(CASE WHEN p.has_published_chapters = TRUE THEN 1 END) as published_count
FROM users u
LEFT JOIN projects p ON u.id = p.initiator_id AND p.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name;

-- ==================== 6. CREATE FUNCTIONS ====================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== 7. CREATE TRIGGERS ====================

-- Trigger: Update users.updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update projects.updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update chapters.updated_at
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update teams.updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update brainstorms.updated_at
CREATE TRIGGER update_brainstorms_updated_at BEFORE UPDATE ON brainstorms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== 8. GRANT PERMISSIONS ====================

-- Create application user (optional)
-- CREATE USER inversa_app WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE inversa_db TO inversa_app;
-- GRANT USAGE ON SCHEMA public TO inversa_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO inversa_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO inversa_app;

-- ==================== DATABASE SETUP COMPLETE ====================
-- 
-- Database: inversa_db
-- Tables: 20
-- Views: 3
-- Functions: 1
-- Triggers: 5
--
-- To connect to the database:
-- psql -U postgres -d inversa_db
--
-- To run this script:
-- psql -U postgres -f INVERSA_DATABASE_SETUP.sql
--
-- ============================================================
