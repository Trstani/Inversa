# INVERSA Platform - Database Design Documentation

## Overview

INVERSA is a collaborative creative writing platform that enables multiple users to work together on projects, chapters, and brainstorming sessions. This document outlines the complete database design, including entities, relationships, constraints, and implementation strategies.

## 1. Data Structure Analysis

### Core Entities (17 Main)

1. **Users** - Platform users with authentication and profile info
2. **Projects** - Creative writing projects (solo or team-based)
3. **Chapters** - Individual chapters within projects
4. **Sections** - Subsections within chapters
5. **Teams** - Collaborative groups of users
6. **Collaborators** - Join table for project/team collaborations
7. **Collaboration Requests** - Pending collaboration requests
8. **Brainstorm** - Brainstorming sessions for projects
9. **Ideas** - Individual ideas within brainstorm sessions
10. **Tasks** - Task management within brainstorm
11. **Comments** - Comments on ideas
12. **Discussions** - Discussion threads
13. **Notes** - Shared notes
14. **Contributions** - User contributions tracking
15. **Categories** - Project categories
16. **Genres** - Project genres
17. **Reports** - User reports for moderation

## 2. PostgreSQL Table Design

### 2.1 Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  profile_image TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2.2 Categories Table

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Genres Table

```sql
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Projects Table

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  initiator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id),
  genre_id INTEGER REFERENCES genres(id),
  background_image TEXT,
  is_team_project BOOLEAN DEFAULT FALSE,
  team_id INTEGER,
  status VARCHAR(50) DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  has_published_chapters BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_projects_initiator_id ON projects(initiator_id);
CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
```

### 2.5 Chapters Table

```sql
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(project_id, chapter_number)
);

CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_status ON chapters(status);
```

### 2.6 Sections Table

```sql
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chapter_id, section_number)
);

CREATE INDEX idx_sections_chapter_id ON sections(chapter_id);
```

### 2.7 Teams Table

```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  initiator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  background_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_teams_initiator_id ON teams(initiator_id);
CREATE INDEX idx_teams_created_at ON teams(created_at);
```

### 2.8 Team Collaborators Table

```sql
CREATE TABLE team_collaborators (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_collaborators_team_id ON team_collaborators(team_id);
CREATE INDEX idx_team_collaborators_user_id ON team_collaborators(user_id);
```

### 2.9 Project Collaborators Table

```sql
CREATE TABLE project_collaborators (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'contributor',
  status VARCHAR(50) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX idx_project_collaborators_user_id ON project_collaborators(user_id);
```

### 2.10 Brainstorm Table

```sql
CREATE TABLE brainstorm (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id)
);

CREATE INDEX idx_brainstorm_project_id ON brainstorm(project_id);
```

### 2.11 Ideas Table

```sql
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorm(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_name VARCHAR(255),
  content TEXT NOT NULL,
  chapter_reference INTEGER REFERENCES chapters(id),
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_brainstorm_id ON ideas(brainstorm_id);
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
```

### 2.12 Comments Table

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_name VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_idea_id ON comments(idea_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

### 2.13 Tasks Table

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorm(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  chapter_reference INTEGER REFERENCES chapters(id),
  section_reference INTEGER REFERENCES sections(id),
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_brainstorm_id ON tasks(brainstorm_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
```

### 2.14 Discussions Table

```sql
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorm(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_name VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discussions_brainstorm_id ON discussions(brainstorm_id);
```

### 2.15 Notes Table

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorm(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_name VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_brainstorm_id ON notes(brainstorm_id);
```

### 2.16 Contributions Table

```sql
CREATE TABLE contributions (
  id SERIAL PRIMARY KEY,
  brainstorm_id INTEGER NOT NULL REFERENCES brainstorm(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  contribution_type VARCHAR(50),
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contributions_brainstorm_id ON contributions(brainstorm_id);
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
```

### 2.17 Reports Table

```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  reported_by INTEGER NOT NULL REFERENCES users(id),
  reason VARCHAR(255) NOT NULL,
  note TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_project_id ON reports(project_id);
CREATE INDEX idx_reports_status ON reports(status);
```

## 3. Relationships

### One-to-Many (1:N)

- **Users → Projects**: One user can create many projects
- **Users → Teams**: One user can create many teams
- **Projects → Chapters**: One project has many chapters
- **Chapters → Sections**: One chapter has many sections
- **Teams → Team Collaborators**: One team has many collaborators
- **Projects → Project Collaborators**: One project has many collaborators
- **Projects → Brainstorm**: One project has one brainstorm (1:1)
- **Brainstorm → Ideas**: One brainstorm has many ideas
- **Brainstorm → Tasks**: One brainstorm has many tasks
- **Brainstorm → Discussions**: One brainstorm has many discussions
- **Brainstorm → Notes**: One brainstorm has many notes
- **Ideas → Comments**: One idea has many comments

### Many-to-Many (N:M)

- **Users ↔ Teams** (via team_collaborators)
- **Users ↔ Projects** (via project_collaborators)

## 4. Constraints & Validations

### Primary Keys
- All tables have `id` as primary key (SERIAL)

### Foreign Keys
- All foreign keys use `ON DELETE CASCADE` for data integrity
- Foreign keys reference appropriate tables

### Unique Constraints
- `users.email` - Unique email per user
- `categories.name` - Unique category names
- `genres.name` - Unique genre names
- `chapters.project_id + chapter_number` - Unique chapter numbers per project
- `sections.chapter_id + section_number` - Unique section numbers per chapter
- `team_collaborators.team_id + user_id` - One user per team
- `project_collaborators.project_id + user_id` - One user per project
- `brainstorm.project_id` - One brainstorm per project

### Check Constraints
- `status` fields limited to valid values (draft, published, pending, etc.)
- `role` fields limited to valid values (owner, member, contributor, etc.)

## 5. Soft Deletes Strategy

Tables with `deleted_at` timestamp:
- users
- projects
- chapters
- teams

Query pattern:
```sql
SELECT * FROM projects WHERE deleted_at IS NULL;
```

## 6. Indexing Strategy

### Performance Indexes
- Foreign key columns (automatic in most cases)
- Frequently queried columns (status, created_at)
- Filter columns (user_id, project_id, team_id)

### Query Optimization
- Composite indexes for common WHERE + ORDER BY combinations
- Partial indexes for soft deletes (WHERE deleted_at IS NULL)

## 7. Migration Order

1. Create base tables: users, categories, genres
2. Create project tables: projects, chapters, sections
3. Create team tables: teams, team_collaborators
4. Create collaboration tables: project_collaborators
5. Create brainstorm tables: brainstorm, ideas, comments, tasks
6. Create discussion tables: discussions, notes, contributions
7. Create reports table

## 8. Query Examples

### Get all published projects
```sql
SELECT p.* FROM projects p
WHERE p.deleted_at IS NULL 
  AND p.has_published_chapters = TRUE
ORDER BY p.created_at DESC;
```

### Get user's team projects
```sql
SELECT p.* FROM projects p
JOIN teams t ON p.team_id = t.id
JOIN team_collaborators tc ON t.id = tc.team_id
WHERE tc.user_id = $1 
  AND tc.status = 'approved'
  AND p.deleted_at IS NULL;
```

### Get chapter with all sections
```sql
SELECT c.*, s.* FROM chapters c
LEFT JOIN sections s ON c.id = s.chapter_id
WHERE c.project_id = $1
ORDER BY c.chapter_number, s.section_number;
```

### Get brainstorm ideas with comments
```sql
SELECT i.*, COUNT(c.id) as comment_count
FROM ideas i
LEFT JOIN comments c ON i.id = c.idea_id
WHERE i.brainstorm_id = $1
GROUP BY i.id
ORDER BY i.votes DESC;
```

## 9. Performance Considerations

### Optimization Strategies
1. **Pagination**: Always use LIMIT/OFFSET for large result sets
2. **Lazy Loading**: Load related data on demand
3. **Caching**: Cache frequently accessed data (categories, genres)
4. **Denormalization**: Store `has_published_chapters` flag for quick filtering
5. **Batch Operations**: Use batch inserts for bulk data

### Query Performance
- Use EXPLAIN ANALYZE for query optimization
- Monitor slow queries with PostgreSQL logs
- Consider materialized views for complex aggregations

## 10. Security Considerations

### Data Protection
- Hash passwords using bcrypt or similar
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement row-level security for sensitive data

### Access Control
- Verify user permissions before operations
- Use role-based access control (RBAC)
- Audit sensitive operations

## 11. Backup & Recovery

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery capability

### Disaster Recovery
- Test recovery procedures regularly
- Maintain backup redundancy
- Document recovery procedures

---

**Last Updated**: May 14, 2026
**Version**: 1.0
