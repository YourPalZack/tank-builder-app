-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tanks Table
create table tanks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- NULL for public/common items
  name text not null,
  brand text,
  dimensions jsonb not null, -- { length, width, height }
  volume_gallons numeric not null,
  volume_liters numeric,
  shape text,
  material text,
  price numeric,
  image_url text,
  link text,
  purchase_links jsonb,
  created_at timestamptz default now()
);

-- 2. Species Table (Fish & Invertebrates)
create table species (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  type text not null check (type in ('fish', 'invertebrate')),
  common_name text not null,
  scientific_name text,
  category text, -- 'Freshwater', 'Saltwater'
  subcategory text, -- 'Tetra', 'Snail', etc.
  adult_size_inches numeric,
  min_tank_gallons numeric,
  swimming_level text,
  water_params jsonb, -- { tempMin, tempMax, phMin, phMax, hardnessMin, hardnessMax }
  temperament text,
  schooling_size int default 1,
  territorial_radius numeric default 0,
  incompatible_with text[], -- Array of IDs or Categories
  predator_of text[],
  prey_to text[],
  nips_at_fins boolean default false,
  incompatible_with_long_finned boolean default false,
  is_long_finned boolean default false,
  care_level text,
  diet text,
  copper_sensitive boolean default false, -- For inverts
  bioload text, -- 'low', 'medium', 'high'
  plant_safe boolean default true,
  price numeric,
  image_url text,
  link text,
  purchase_links jsonb,
  created_at timestamptz default now()
);

-- 3. Plants Table
create table plants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  common_name text not null,
  scientific_name text,
  category text,
  light_requirement text,
  co2_required boolean default false,
  co2_recommended boolean default false,
  substrate_type text,
  water_params jsonb,
  growth_rate text,
  max_height_inches numeric,
  placement text,
  incompatible_with_fish text[],
  price numeric,
  image_url text,
  link text,
  purchase_links jsonb,
  created_at timestamptz default now()
);

-- 4. Equipment Table
create table equipment (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  brand text,
  category text not null, -- 'Filter', 'Heater', 'Light', etc.
  price numeric,
  min_tank_gallons numeric,
  max_tank_gallons numeric,
  flow_rate_gph numeric, -- For filters
  watts numeric, -- For heaters/lights
  lumens numeric, -- For lights
  length_inches numeric, -- For lights
  filter_type text, -- For filters
  image_url text,
  link text,
  purchase_links jsonb,
  created_at timestamptz default now()
);

-- 5. Substrates Table
create table substrates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  brand text,
  type text, -- 'soil', 'sand', 'gravel'
  nutrient_rich boolean default false,
  buffers_ph boolean default false,
  buffers_to numeric,
  grain_size_mm numeric,
  color text,
  pounds_per_gallon numeric,
  bag_size_pounds numeric,
  price numeric,
  image_url text,
  link text,
  purchase_links jsonb,
  created_at timestamptz default now()
);

-- 6. Builds Table
create table builds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  total_cost numeric default 0,
  stocking_level numeric default 0,
  configuration jsonb not null, -- Stores the full build structure with IDs and quantities
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table tanks enable row level security;
alter table species enable row level security;
alter table plants enable row level security;
alter table equipment enable row level security;
alter table substrates enable row level security;
alter table builds enable row level security;

-- Policies for Catalog Tables (Tanks, Species, Plants, Equipment, Substrates)
-- 1. Everyone can read public items (user_id is null)
-- 2. Users can read their own private items (user_id = auth.uid())
-- 3. Users can insert their own private items
-- 4. Users can delete their own private items

create policy "Public items are visible to everyone" on tanks for select using (user_id is null);
create policy "Users can see their own tanks" on tanks for select using (auth.uid() = user_id);
create policy "Users can insert their own tanks" on tanks for insert with check (auth.uid() = user_id);
create policy "Users can delete their own tanks" on tanks for delete using (auth.uid() = user_id);

create policy "Public items are visible to everyone" on species for select using (user_id is null);
create policy "Users can see their own species" on species for select using (auth.uid() = user_id);
create policy "Users can insert their own species" on species for insert with check (auth.uid() = user_id);
create policy "Users can delete their own species" on species for delete using (auth.uid() = user_id);

create policy "Public items are visible to everyone" on plants for select using (user_id is null);
create policy "Users can see their own plants" on plants for select using (auth.uid() = user_id);
create policy "Users can insert their own plants" on plants for insert with check (auth.uid() = user_id);
create policy "Users can delete their own plants" on plants for delete using (auth.uid() = user_id);

create policy "Public items are visible to everyone" on equipment for select using (user_id is null);
create policy "Users can see their own equipment" on equipment for select using (auth.uid() = user_id);
create policy "Users can insert their own equipment" on equipment for insert with check (auth.uid() = user_id);
create policy "Users can delete their own equipment" on equipment for delete using (auth.uid() = user_id);

create policy "Public items are visible to everyone" on substrates for select using (user_id is null);
create policy "Users can see their own substrates" on substrates for select using (auth.uid() = user_id);
create policy "Users can insert their own substrates" on substrates for insert with check (auth.uid() = user_id);
create policy "Users can delete their own substrates" on substrates for delete using (auth.uid() = user_id);

-- Policies for Builds Table
-- Users can only see, insert, update, delete their own builds
create policy "Users can see their own builds" on builds for select using (auth.uid() = user_id);
create policy "Users can insert their own builds" on builds for insert with check (auth.uid() = user_id);
create policy "Users can update their own builds" on builds for update using (auth.uid() = user_id);
create policy "Users can delete their own builds" on builds for delete using (auth.uid() = user_id);
