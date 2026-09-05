-- KYA Seed Data — Realistic demo agents, credentials, and transactions
-- Run AFTER 0001_init.sql

-- ============================================================
-- AGENTS (6 demo agents)
-- ============================================================
insert into agents (id, owner_user_id, name, status, created_at) values
  ('a1111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'GroceryBot', 'active', now() - interval '14 days'),
  ('a2222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440001', 'TravelPlanner', 'active', now() - interval '10 days'),
  ('a3333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440002', 'BillPayAssist', 'active', now() - interval '7 days'),
  ('a4444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440003', 'PriceHunter', 'revoked', now() - interval '21 days'),
  ('a5555555-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440004', 'SubManager', 'active', now() - interval '3 days'),
  ('a6666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440005', 'ExpenseTracker', 'active', now() - interval '1 day')
on conflict (id) do nothing;

-- ============================================================
-- CREDENTIALS (active + historical)
-- ============================================================
-- GroceryBot: ₹5,000 limit, groceries+utilities, 30 days
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 5000, '{"groceries","utilities"}', 'demo_token_grocery_001', now() + interval '25 days', 'active', now() - interval '5 days');

-- TravelPlanner: ₹25,000 limit, travel+dining, 14 days
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 25000, '{"travel","dining"}', 'demo_token_travel_001', now() + interval '9 days', 'active', now() - interval '5 days');

-- BillPayAssist: ₹10,000 limit, utilities+subscriptions, 30 days
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 10000, '{"utilities","subscriptions"}', 'demo_token_bills_001', now() + interval '25 days', 'active', now() - interval '5 days');

-- PriceHunter: revoked credential
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 15000, '{"electronics","groceries"}', 'demo_token_price_001', now() + interval '10 days', 'revoked', now() - interval '18 days');

-- SubManager: ₹3,000 limit
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 3000, '{"subscriptions","entertainment"}', 'demo_token_subs_001', now() + interval '27 days', 'active', now() - interval '3 days');

-- ExpenseTracker: ₹20,000 limit
insert into credentials (id, agent_id, max_amount, allowed_categories, token, expires_at, status, issued_at) values
  ('c6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 20000, '{"groceries","dining","travel","entertainment"}', 'demo_token_expense_001', now() + interval '27 days', 'active', now() - interval '1 day');

-- ============================================================
-- TRANSACTIONS (realistic spread over the last 7 days)
-- ============================================================
-- GroceryBot transactions
insert into transactions (id, credential_id, agent_id, amount, category, created_at) values
  ('t1000001-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 1200, 'groceries', now() - interval '6 days' - interval '2 hours'),
  ('t1000002-0000-0000-0000-000000000002', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 850, 'groceries', now() - interval '5 days' - interval '1 hours'),
  ('t1000003-0000-0000-0000-000000000003', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 2500, 'utilities', now() - interval '4 days' - interval '3 hours'),
  ('t1000004-0000-0000-0000-000000000004', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 600, 'groceries', now() - interval '3 days' - interval '4 hours'),
  ('t1000005-0000-0000-0000-000000000005', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 900, 'groceries', now() - interval '2 days' - interval '2 hours'),
  ('t1000006-0000-0000-0000-000000000006', 'c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 4200, 'groceries', now() - interval '1 days' - interval '1 hours');

-- TravelPlanner transactions
insert into transactions (id, credential_id, agent_id, amount, category, created_at) values
  ('t2000001-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 8500, 'travel', now() - interval '5 days' - interval '6 hours'),
  ('t2000002-0000-0000-0000-000000000002', 'c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 1200, 'dining', now() - interval '4 days' - interval '7 hours'),
  ('t2000003-0000-0000-0000-000000000003', 'c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 3500, 'travel', now() - interval '2 days' - interval '5 hours'),
  ('t2000004-0000-0000-0000-000000000004', 'c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 22000, 'travel', now() - interval '1 days' - interval '3 hours');

-- BillPayAssist transactions
insert into transactions (id, credential_id, agent_id, amount, category, created_at) values
  ('t3000001-0000-0000-0000-000000000001', 'c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 2100, 'utilities', now() - interval '6 days' - interval '8 hours'),
  ('t3000002-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 599, 'subscriptions', now() - interval '3 days' - interval '9 hours'),
  ('t3000003-0000-0000-0000-000000000003', 'c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 1450, 'utilities', now() - interval '1 days' - interval '10 hours');

-- ExpenseTracker transactions
insert into transactions (id, credential_id, agent_id, amount, category, created_at) values
  ('t6000001-0000-0000-0000-000000000001', 'c6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 780, 'groceries', now() - interval '12 hours'),
  ('t6000002-0000-0000-0000-000000000002', 'c6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 3200, 'dining', now() - interval '6 hours'),
  ('t6000003-0000-0000-0000-000000000003', 'c6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 18500, 'travel', now() - interval '2 hours');

-- ============================================================
-- DECISIONS (one per transaction)
-- ============================================================
-- GroceryBot: all approved (within scope)
insert into decisions (transaction_id, decision_type, reason) values
  ('t1000001-0000-0000-0000-000000000001', 'approve', 'within scope'),
  ('t1000002-0000-0000-0000-000000000002', 'approve', 'within scope'),
  ('t1000003-0000-0000-0000-000000000003', 'approve', 'within scope'),
  ('t1000004-0000-0000-0000-000000000004', 'approve', 'within scope'),
  ('t1000005-0000-0000-0000-000000000005', 'approve', 'within scope'),
  ('t1000006-0000-0000-0000-000000000006', 'approve', 'within scope');

-- TravelPlanner: first 3 approved, last one approved but close to ceiling
insert into decisions (transaction_id, decision_type, reason) values
  ('t2000001-0000-0000-0000-000000000001', 'approve', 'within scope'),
  ('t2000002-0000-0000-0000-000000000002', 'approve', 'within scope'),
  ('t2000003-0000-0000-0000-000000000003', 'approve', 'within scope'),
  ('t2000004-0000-0000-0000-000000000004', 'approve', 'within scope — amount close to ceiling');

-- BillPayAssist: all approved
insert into decisions (transaction_id, decision_type, reason) values
  ('t3000001-0000-0000-0000-000000000001', 'approve', 'within scope'),
  ('t3000002-0000-0000-0000-000000000002', 'approve', 'within scope'),
  ('t3000003-0000-0000-0000-000000000003', 'approve', 'within scope');

-- ExpenseTracker: first 2 approved, third close to ceiling
insert into decisions (transaction_id, decision_type, reason) values
  ('t6000001-0000-0000-0000-000000000001', 'approve', 'within scope'),
  ('t6000002-0000-0000-0000-000000000002', 'approve', 'within scope'),
  ('t6000003-0000-0000-0000-000000000003', 'approve', 'within scope — amount close to ceiling');

-- ============================================================
-- ANOMALY FLAGS (3 realistic flags)
-- ============================================================
-- GroceryBot: ₹4,200 transaction is 84% of ₹5,000 ceiling → flagged
insert into anomaly_flags (transaction_id, agent_id, risk_score, reason, reason_codes, status, created_at) values
  ('t1000006-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 0.55,
   'amount is over 80% of the agent''s max_amount',
   '["amount is over 80% of the agent''s max_amount"]',
   'open', now() - interval '1 days');

-- TravelPlanner: ₹22,000 is 88% of ₹25,000 ceiling → flagged
insert into anomaly_flags (transaction_id, agent_id, risk_score, reason, reason_codes, status, created_at) values
  ('t2000004-0000-0000-0000-000000000004', 'a2222222-2222-2222-2222-222222222222', 0.55,
   'amount is over 80% of the agent''s max_amount',
   '["amount is over 80% of the agent''s max_amount"]',
   'escalated', now() - interval '1 days');

-- ExpenseTracker: ₹18,500 is 92.5% of ₹20,000 ceiling → high risk
insert into anomaly_flags (transaction_id, agent_id, risk_score, reason, reason_codes, status, created_at) values
  ('t6000003-0000-0000-0000-000000000003', 'a6666666-6666-6666-6666-666666666666', 0.80,
   'amount is over 80% of the agent''s max_amount; transaction amount ₹18,500 is unusually high for this agent',
   '["amount is over 80% of the agent''s max_amount","unusually high transaction amount"]',
   'open', now() - interval '2 hours');

-- ============================================================
-- REVOCATION EVENTS (PriceHunter was revoked)
-- ============================================================
insert into revocation_events (agent_id, reason, revoked_by, created_at) values
  ('a4444444-4444-4444-4444-444444444444', 'Agent was attempting purchases outside allowed categories and exceeding scope limits repeatedly', 'admin_hcharan', now() - interval '18 days');

-- ============================================================
-- AUDIT LOGS (comprehensive trail)
-- ============================================================
insert into audit_logs (entity_type, entity_id, action, actor, details, created_at) values
  ('agent', 'a1111111-1111-1111-1111-111111111111', 'agent_registered', 'system', 'Registered agent "GroceryBot"', now() - interval '14 days'),
  ('credential', 'c1111111-1111-1111-1111-111111111111', 'credential_issued', 'admin_hcharan', 'Issued: max 5000, categories: groceries, utilities', now() - interval '5 days'),
  ('agent', 'a2222222-2222-2222-2222-222222222222', 'agent_registered', 'system', 'Registered agent "TravelPlanner"', now() - interval '10 days'),
  ('credential', 'c2222222-2222-2222-2222-222222222222', 'credential_issued', 'admin_hcharan', 'Issued: max 25000, categories: travel, dining', now() - interval '5 days'),
  ('agent', 'a3333333-3333-3333-3333-333333333333', 'agent_registered', 'system', 'Registered agent "BillPayAssist"', now() - interval '7 days'),
  ('credential', 'c3333333-3333-3333-3333-333333333333', 'credential_issued', 'admin_hcharan', 'Issued: max 10000, categories: utilities, subscriptions', now() - interval '5 days'),
  ('agent', 'a4444444-4444-4444-4444-444444444444', 'agent_registered', 'system', 'Registered agent "PriceHunter"', now() - interval '21 days'),
  ('credential', 'c4444444-4444-4444-4444-444444444444', 'credential_issued', 'admin_hcharan', 'Issued: max 15000, categories: electronics, groceries', now() - interval '18 days'),
  ('agent', 'a4444444-4444-4444-4444-444444444444', 'agent_revoked', 'admin_hcharan', 'Agent was attempting purchases outside allowed categories and exceeding scope limits repeatedly', now() - interval '18 days'),
  ('agent', 'a5555555-5555-5555-5555-555555555555', 'agent_registered', 'system', 'Registered agent "SubManager"', now() - interval '3 days'),
  ('credential', 'c5555555-5555-5555-5555-555555555555', 'credential_issued', 'admin_hcharan', 'Issued: max 3000, categories: subscriptions, entertainment', now() - interval '3 days'),
  ('agent', 'a6666666-6666-6666-6666-666666666666', 'agent_registered', 'system', 'Registered agent "ExpenseTracker"', now() - interval '1 day'),
  ('credential', 'c6666666-6666-6666-6666-666666666666', 'credential_issued', 'admin_hcharan', 'Issued: max 20000, categories: groceries, dining, travel, entertainment', now() - interval '1 day'),
  ('transaction', 't1000001-0000-0000-0000-000000000001', 'transaction_approved', 'GroceryBot', '₹1200 approved for groceries', now() - interval '6 days'),
  ('transaction', 't1000002-0000-0000-0000-000000000002', 'transaction_approved', 'GroceryBot', '₹850 approved for groceries', now() - interval '5 days'),
  ('transaction', 't1000003-0000-0000-0000-000000000003', 'transaction_approved', 'GroceryBot', '₹2500 approved for utilities', now() - interval '4 days'),
  ('transaction', 't2000001-0000-0000-0000-000000000001', 'transaction_approved', 'TravelPlanner', '₹8500 approved for travel', now() - interval '5 days'),
  ('transaction', 't2000004-0000-0000-0000-000000000004', 'transaction_approved', 'TravelPlanner', '₹22000 approved for travel', now() - interval '1 days'),
  ('anomaly_flag', 'flag-escalated-travel', 'flag_escalated', 'admin_hcharan', 'Escalated: TravelPlanner ₹22,000 travel transaction — 88% of ceiling', now() - interval '1 days');

-- ============================================================
-- POLICY SETTINGS (already seeded in 0001_init.sql via on conflict)
-- ============================================================

-- ============================================================
-- PENDING CREDENTIALS (demo: one pending high-value request)
-- ============================================================
insert into pending_credentials (id, agent_id, max_amount, allowed_categories, expires_in_days, requested_by, status, created_at) values
  ('p1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 100000, '{"travel","dining","hotels"}', 14, 'admin_dashboard', 'pending', now() - interval '12 hours'),
  ('p2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666', 75000, '{"travel","entertainment"}', 30, 'admin_dashboard', 'pending', now() - interval '6 hours');

-- ============================================================
-- NETWORK EDGES (demo: GroceryBot and PriceHunter share an owner pattern)
-- ============================================================
insert into network_edges (source_id, target_id, edge_type, confidence) values
  ('a1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 'shared_owner', 1.0),
  ('a2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666', 'shared_ip', 0.75);
