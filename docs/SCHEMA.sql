-- ============================================================================
-- Beyond Concierge — Executive OS · Database Schema (PostgreSQL)
-- Mirrors the front-end data model in src/data/* one-to-one.
-- Drop into Supabase / Postgres and replace the static imports with queries.
-- ============================================================================

-- ── Services & Profit Engine ────────────────────────────────────────────────
create table services (
  id              text primary key,
  name            text not null,
  category        text not null,          -- Injectables | Body | IV & NAD | Weight Loss | Concierge | Membership
  unit_label      text not null,
  retail          numeric(10,2) not null,
  product_cost    numeric(10,2) not null,
  nurse_cost      numeric(10,2) not null,
  labor_cost      numeric(10,2) not null,
  monthly_volume  integer not null,
  recurring       boolean default false,
  created_at      timestamptz default now()
);
-- gross_profit, margin, cc_cost are computed in the app (CC_RATE = 2.9% + $0.30)

-- ── Transactions (feeds revenue, KPIs, P&L) ─────────────────────────────────
create table transactions (
  id              uuid primary key default gen_random_uuid(),
  service_id      text references services(id),
  customer_id     uuid references customers(id),
  amount          numeric(10,2) not null,
  cc_fee          numeric(10,2) not null default 0,
  refunded        boolean default false,
  occurred_at     timestamptz not null default now()
);

create table customers (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  first_seen      date not null,
  is_member       boolean default false
);

-- ── Monthly financial summary (P&L snapshot) ────────────────────────────────
create table financial_periods (
  id                uuid primary key default gen_random_uuid(),
  period_start      date not null unique,
  gross_revenue     numeric(12,2) not null,
  cc_fees           numeric(12,2) not null,
  processing_fees   numeric(12,2) not null,
  refunds           numeric(12,2) not null,
  payroll           numeric(12,2) not null,
  contractor_costs  numeric(12,2) not null,
  nurse_costs       numeric(12,2) not null,
  inventory_costs   numeric(12,2) not null,
  marketing_costs   numeric(12,2) not null
);

-- ── IV Recipe Calculator ────────────────────────────────────────────────────
create table iv_ingredients (
  id             text primary key,
  name           text not null,
  unit           text not null,           -- mL | 100mg | bag
  unit_cost      numeric(10,4) not null,
  supplier       text,
  stock          numeric(12,2) not null,  -- live, decremented on dispense
  reorder_level  numeric(12,2) not null
);

create table iv_recipes (
  id      text primary key,
  name    text not null,
  retail  numeric(10,2) not null
);

create table iv_recipe_lines (
  recipe_id      text references iv_recipes(id),
  ingredient_id  text references iv_ingredients(id),
  amount         numeric(10,2) not null,
  primary key (recipe_id, ingredient_id)
);

create table iv_dispenses (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   text references iv_recipes(id),
  total_cost  numeric(10,2) not null,
  retail      numeric(10,2) not null,
  dispensed_at timestamptz default now()
);

-- ── GLP-1 Margin Center ─────────────────────────────────────────────────────
create table glp1_products (
  id                        text primary key,
  name                      text not null,
  program_price             numeric(10,2) not null,
  maintenance_mg_per_month  numeric(10,2) not null,
  nurse_cost_monthly        numeric(10,2) not null
);

create table glp1_vials (
  id            text primary key,
  product_id    text references glp1_products(id),
  lot           text not null,
  purchase_cost numeric(10,2) not null,
  mg_purchased  numeric(10,2) not null,
  remaining_mg  numeric(10,2) not null,  -- live, decremented on dose
  supplier      text,
  expires       date
);
-- cost_per_mg = sum(purchase_cost) / sum(mg_purchased) per product

create table glp1_patients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  product_id    text references glp1_products(id),
  weekly_dose_mg numeric(10,2) not null,
  months_active integer default 0
);

create table glp1_doses (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid references glp1_patients(id),
  vial_id     text references glp1_vials(id),
  mg          numeric(10,2) not null,
  dosed_at    timestamptz default now()
);

-- ── Inventory Command Center ────────────────────────────────────────────────
create table inventory_items (
  id             text primary key,
  name           text not null,
  category       text not null,           -- Injectables | IV & Nutrients | Weight Loss | Supplies | Retail
  unit           text not null,
  stock          numeric(12,2) not null,
  unit_cost      numeric(10,2) not null,
  reorder_level  numeric(12,2) not null,
  supplier       text,
  monthly_usage  numeric(12,2) not null,
  margin_pct     numeric(5,2) not null,
  expires        date
);

-- ── Website & SEO ───────────────────────────────────────────────────────────
create table seo_keywords (
  id        uuid primary key default gen_random_uuid(),
  keyword   text not null,
  position  integer not null,
  prev      integer not null,
  volume    integer not null,
  url       text
);

create table seo_pages (
  url         text primary key,
  views       integer not null,
  conversion  numeric(5,2) not null,
  trend       numeric(6,2) not null,
  issues      text[]
);

-- ── Social ──────────────────────────────────────────────────────────────────
create table social_channels (
  id            text primary key,
  name          text not null,
  followers     integer not null,
  growth        numeric(5,2) not null,
  engagement    numeric(5,2) not null,
  reach         integer not null,
  leads         integer not null,
  health        integer not null,
  posts_this_week integer not null,
  weekly_goal   integer not null
);

create table content_calendar (
  id        uuid primary key default gen_random_uuid(),
  day       text not null,
  channel   text not null,
  title     text not null,
  type      text not null,                -- Reel | Story | Post | Video | Carousel
  status    text not null                 -- scheduled | posted | missed
);

-- ── Advertising ─────────────────────────────────────────────────────────────
create table ad_campaigns (
  id            text primary key,
  platform      text not null,            -- Meta | Google | TikTok | YouTube
  name          text not null,
  spend         numeric(10,2) not null,
  leads         integer not null,
  appointments  integer not null,
  revenue       numeric(12,2) not null
);
-- cpl, cpa, cac, roas, roi are computed in the app

-- ── CRM & Partnerships ──────────────────────────────────────────────────────
create table partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null,            -- Gym | Influencer | Doctor | Chiropractor | Wellness Center | Med Spa | Corporate
  contact       text,
  status        text not null,            -- Active | Nurturing | At Risk | New Lead
  leads         integer default 0,
  appointments  integer default 0,
  revenue       numeric(12,2) default 0,
  last_touch    date,
  next_follow_up date,
  notes         text
);

-- ── 90-Day Growth Plan ──────────────────────────────────────────────────────
create table growth_phases (
  id     text primary key,
  range  text not null,
  focus  text not null,
  theme  text
);

create table growth_tasks (
  id        text primary key,
  phase_id  text references growth_phases(id),
  title     text not null,
  owner     text,
  impact    text not null,                -- High | Medium | Low
  done      boolean default false
);

-- ── Helpful indexes ─────────────────────────────────────────────────────────
create index on transactions (occurred_at);
create index on transactions (service_id);
create index on glp1_doses (patient_id);
create index on iv_dispenses (dispensed_at);
