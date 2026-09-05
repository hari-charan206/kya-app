-- KYA (Know Your Agent) — Initial Schema
-- Tables: agents, credentials, transactions, decisions, anomaly_flags,
--         revocation_events, audit_logs, policy_settings

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- AGENTS
-- ============================================================
create table if not exists agents (
  id            uuid primary key default uuid_generate_v4(),
  owner_user_id uuid not null,
  name          text not null,
  status        text not null default 'active' check (status in ('active','revoked','suspended','pending')),
  created_at    timestamptz not null default now()
);

create index if not exists idx_agents_owner on agents(owner_user_id);
create index if not exists idx_agents_status on agents(status);

-- ============================================================
-- CREDENTIALS
-- ============================================================
create table if not exists credentials (
  id                 uuid primary key default uuid_generate_v4(),
  agent_id           uuid not null references agents(id) on delete cascade,
  max_amount         numeric not null,
  allowed_categories text[] not null default '{}',
  token              text not null,
  expires_at         timestamptz,
  status             text not null default 'active' check (status in ('active','revoked','expired')),
  issued_at          timestamptz not null default now()
);

create index if not exists idx_credentials_agent on credentials(agent_id);
create index if not exists idx_credentials_status on credentials(status);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
create table if not exists transactions (
  id             uuid primary key default uuid_generate_v4(),
  credential_id  uuid not null references credentials(id) on delete cascade,
  agent_id       uuid not null references agents(id) on delete cascade,
  amount         numeric not null,
  category       text not null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_transactions_agent on transactions(agent_id);
create index if not exists idx_transactions_credential on transactions(credential_id);
create index if not exists idx_transactions_created on transactions(created_at);

-- ============================================================
-- DECISIONS (one per transaction)
-- ============================================================
create table if not exists decisions (
  id             uuid primary key default uuid_generate_v4(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  decision_type  text not null check (decision_type in ('approve','deny')),
  reason         text not null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_decisions_transaction on decisions(transaction_id);

-- ============================================================
-- ANOMALY FLAGS
-- ============================================================
create table if not exists anomaly_flags (
  id             uuid primary key default uuid_generate_v4(),
  transaction_id uuid references transactions(id) on delete set null,
  agent_id       uuid not null references agents(id) on delete cascade,
  risk_score     numeric not null,
  reason         text not null,
  reason_codes   jsonb not null default '[]',
  status         text not null default 'open' check (status in ('open','dismissed','escalated','resolved')),
  analyst_rationale text,
  resolved_by    text,
  created_at     timestamptz not null default now(),
  resolved_at    timestamptz
);

create index if not exists idx_anomaly_flags_agent on anomaly_flags(agent_id);
create index if not exists idx_anomaly_flags_status on anomaly_flags(status);

-- ============================================================
-- REVOCATION EVENTS
-- ============================================================
create table if not exists revocation_events (
  id          uuid primary key default uuid_generate_v4(),
  agent_id    uuid not null references agents(id) on delete cascade,
  reason      text not null,
  revoked_by  text not null default 'admin_dashboard',
  created_at  timestamptz not null default now()
);

create index if not exists idx_revocation_events_agent on revocation_events(agent_id);

-- ============================================================
-- AUDIT LOGS (immutable append-only)
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
-- POLICY SETTINGS (singleton-like, one row per key)
-- ============================================================
create table if not exists policy_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- Seed default policy values
insert into policy_settings (key, value, updated_by) values
  ('max_auto_approved_credential', to_jsonb(50000), 'system'),
  ('default_expiry_days', to_jsonb(30), 'system'),
  ('fail_mode', to_jsonb('fail-safe'), 'system')
on conflict (key) do nothing;

-- ============================================================
-- PENDING CREDENTIAL APPROVALS (for high-value credentials)
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
-- NETWORK GRAPH EDGES (for coordinated abuse detection)
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
-- DEVELOPER APPS (for developer portal)
-- ============================================================
create table if not exists developer_apps (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null,
  name         text not null,
  api_key      text not null,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table agents enable row level security;
alter table credentials enable row level security;
alter table transactions enable row level security;
alter table decisions enable row level security;
alter table anomaly_flags enable row level security;
alter table revocation_events enable row level security;
alter table audit_logs enable row level security;
alter table policy_settings enable row level security;
alter table pending_credentials enable row level security;
alter table network_edges enable row level security;
alter table developer_apps enable row level security;

-- Permissive authenticated-role policies (allows all operations for authenticated users)
-- In production, these would be more restrictive per-role.
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'agents') then
    create policy allow_authenticated_all on agents for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'credentials') then
    create policy allow_authenticated_all on credentials for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'transactions') then
    create policy allow_authenticated_all on transactions for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'decisions') then
    create policy allow_authenticated_all on decisions for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'anomaly_flags') then
    create policy allow_authenticated_all on anomaly_flags for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'revocation_events') then
    create policy allow_authenticated_all on revocation_events for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'audit_logs') then
    create policy allow_authenticated_all on audit_logs for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'policy_settings') then
    create policy allow_authenticated_all on policy_settings for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'pending_credentials') then
    create policy allow_authenticated_all on pending_credentials for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'network_edges') then
    create policy allow_authenticated_all on network_edges for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'allow_authenticated_all' and tablename = 'developer_apps') then
    create policy allow_authenticated_all on developer_apps for all using (auth.role() = 'authenticated');
  end if;
end $$;
