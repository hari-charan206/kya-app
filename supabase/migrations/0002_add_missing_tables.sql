-- Migration 0002: Add missing tables and RLS policies
-- Tables that already exist: agents, credentials, transactions, decisions,
--   anomaly_flags, revocation_events
-- Creating: audit_logs, policy_settings, pending_credentials, network_edges, developer_apps

-- ============================================================
-- AUDIT LOGS (if missing)
-- ============================================================
create table if not exists audit_logs (
  id           uuid primary key default uuid_generate_v4(),
  entity_type  text not null,
  entity_id    text not null,
  action       text not null,
  actor        text not null,
  details      text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_action on audit_logs(action);
create index if not exists idx_audit_logs_actor on audit_logs(actor);
create index if not exists idx_audit_logs_created on audit_logs(created_at);

-- ============================================================
-- POLICY SETTINGS
-- ============================================================
create table if not exists policy_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

insert into policy_settings (key, value, updated_by) values
  ('max_auto_approved_credential', to_jsonb(50000), 'system'),
  ('default_expiry_days', to_jsonb(30), 'system'),
  ('fail_mode', to_jsonb('fail-safe'), 'system')
on conflict (key) do nothing;

-- ============================================================
-- PENDING CREDENTIAL APPROVALS
-- ============================================================
create table if not exists pending_credentials (
  id                 uuid primary key default uuid_generate_v4(),
  agent_id           uuid not null references agents(id) on delete cascade,
  max_amount         numeric not null,
  allowed_categories text[] not null default '{}',
  expires_in_days    integer not null,
  requested_by       text not null,
  status             text not null default 'pending' check (status in ('pending','approved','rejected')),
  approved_by        text,
  created_at         timestamptz not null default now(),
  resolved_at        timestamptz
);

-- ============================================================
-- NETWORK GRAPH EDGES
-- ============================================================
create table if not exists network_edges (
  id          uuid primary key default uuid_generate_v4(),
  source_id   text not null,
  target_id   text not null,
  edge_type   text not null check (edge_type in ('shared_owner','shared_device','shared_ip','shared_fingerprint')),
  confidence  numeric not null default 1.0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_network_edges_source on network_edges(source_id);
create index if not exists idx_network_edges_target on network_edges(target_id);

-- ============================================================
-- DEVELOPER APPS
-- ============================================================
create table if not exists developer_apps (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null,
  name         text not null,
  api_key      text not null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — enable on new tables + add policies
-- ============================================================
alter table audit_logs enable row level security;
alter table policy_settings enable row level security;
alter table pending_credentials enable row level security;
alter table network_edges enable row level security;
alter table developer_apps enable row level security;

-- Permissive authenticated-role policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'audit_logs') THEN
    CREATE POLICY allow_authenticated_all ON audit_logs FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'policy_settings') THEN
    CREATE POLICY allow_authenticated_all ON policy_settings FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'pending_credentials') THEN
    CREATE POLICY allow_authenticated_all ON pending_credentials FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'network_edges') THEN
    CREATE POLICY allow_authenticated_all ON network_edges FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'developer_apps') THEN
    CREATE POLICY allow_authenticated_all ON developer_apps FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ============================================================
-- Add missing RLS policies on existing tables if absent
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'agents') THEN
    CREATE POLICY allow_authenticated_all ON agents FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'credentials') THEN
    CREATE POLICY allow_authenticated_all ON credentials FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'transactions') THEN
    CREATE POLICY allow_authenticated_all ON transactions FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'decisions') THEN
    CREATE POLICY allow_authenticated_all ON decisions FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'anomaly_flags') THEN
    CREATE POLICY allow_authenticated_all ON anomaly_flags FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_all' AND tablename = 'revocation_events') THEN
    CREATE POLICY allow_authenticated_all ON revocation_events FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- ============================================================
-- SEED DATA: pending credentials for demo
-- ============================================================
-- Only insert if no pending credentials exist yet
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pending_credentials LIMIT 1) THEN
    INSERT INTO pending_credentials (id, agent_id, max_amount, allowed_categories, expires_in_days, requested_by, status, created_at) VALUES
      ('p1111111-1111-1111-1111-111111111111', (SELECT id FROM agents WHERE name = 'TravelPlanner' LIMIT 1), 100000, ARRAY['travel','dining','hotels'], 14, 'admin_dashboard', 'pending', now() - interval '12 hours'),
      ('p2222222-2222-2222-2222-222222222222', (SELECT id FROM agents WHERE name = 'ExpenseTracker' LIMIT 1), 75000, ARRAY['travel','entertainment'], 30, 'admin_dashboard', 'pending', now() - interval '6 hours');
  END IF;
END $$;
