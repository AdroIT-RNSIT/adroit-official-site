-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id              BIGSERIAL PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE,
  event_name      TEXT NOT NULL,
  team_name       TEXT NOT NULL,
  college_name    TEXT NOT NULL,
  leader_email    TEXT NOT NULL,
  leader_usn      TEXT,
  participants    JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (for AI chat / API key storage)
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  email           TEXT UNIQUE,
  approved        BOOLEAN DEFAULT FALSE,
  gemini_api_key  TEXT,
  has_api_key     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (recommended)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow backend (service_role key) full access — no extra policy needed for service_role
-- Allow anyone to INSERT a registration (public event registration)
CREATE POLICY "Allow public registration inserts"
  ON registrations FOR INSERT
  WITH CHECK (true);
