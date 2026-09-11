-- =========================================================
-- Esquema de base de datos: Sistema Interno de Veterinaria
-- =========================================================
-- Ejecuta este script completo en el SQL Editor de tu proyecto
-- de Supabase (https://app.supabase.com -> tu proyecto -> SQL Editor).
-- =========================================================

-- Extensión para generar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Tabla: owners (dueños de las mascotas)
-- ---------------------------------------------------------
create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- Tabla: patients (pacientes / mascotas)
-- ---------------------------------------------------------
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references owners(id) on delete cascade,
  name text not null,
  species text not null default 'Perro',
  breed text,
  sex text default 'Desconocido',
  birth_date date,
  weight_kg numeric(6,2),
  color text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patients_owner on patients(owner_id);

-- ---------------------------------------------------------
-- Tabla: services (catálogo opcional de servicios/productos)
-- ---------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_price numeric(10,2) not null default 0,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- Tabla: appointments (citas)
-- ---------------------------------------------------------
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  reason text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pendiente' check (status in ('pendiente','confirmada','completada','cancelada')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_patient on appointments(patient_id);
create index if not exists idx_appointments_start on appointments(start_time);

-- ---------------------------------------------------------
-- Tabla: invoices (facturas)
-- ---------------------------------------------------------
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  owner_id uuid not null references owners(id) on delete restrict,
  patient_id uuid references patients(id) on delete set null,
  issue_date date not null default current_date,
  due_date date,
  status text not null default 'pendiente' check (status in ('pendiente','parcial','pagada','vencida','cancelada')),
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  paid_amount numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invoices_owner on invoices(owner_id);
create index if not exists idx_invoices_status on invoices(status);

-- ---------------------------------------------------------
-- Tabla: invoice_items (partidas de la factura)
-- ---------------------------------------------------------
create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null default 0,
  line_total numeric(10,2) generated always as (quantity * unit_price) stored
);

create index if not exists idx_invoice_items_invoice on invoice_items(invoice_id);

-- ---------------------------------------------------------
-- Tabla: payments (pagos recibidos contra una factura)
-- ---------------------------------------------------------
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  payment_date date not null default current_date,
  method text not null default 'efectivo' check (method in ('efectivo','tarjeta','transferencia','otro')),
  reference text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_payments_invoice on payments(invoice_id);

-- =========================================================
-- Función y triggers: recalcular paid_amount y status en invoices
-- cada vez que se inserta, actualiza o elimina un pago
-- =========================================================
create or replace function recalc_invoice_status() returns trigger as $$
declare
  v_invoice_id uuid;
  v_total numeric(10,2);
  v_paid numeric(10,2);
  v_due date;
begin
  v_invoice_id := coalesce(new.invoice_id, old.invoice_id);

  select total, due_date into v_total, v_due from invoices where id = v_invoice_id;

  select coalesce(sum(amount), 0) into v_paid from payments where invoice_id = v_invoice_id;

  update invoices
  set paid_amount = v_paid,
      status = case
        when v_total > 0 and v_paid >= v_total then 'pagada'
        when v_paid > 0 and v_paid < v_total then 'parcial'
        when v_due is not null and v_due < current_date and v_paid < v_total then 'vencida'
        else 'pendiente'
      end,
      updated_at = now()
  where id = v_invoice_id;

  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists trg_payments_recalc on payments;
create trigger trg_payments_recalc
after insert or update or delete on payments
for each row execute function recalc_invoice_status();

-- Recalcular subtotal/total de la factura cuando cambian sus partidas
create or replace function recalc_invoice_totals() returns trigger as $$
declare
  v_invoice_id uuid;
  v_subtotal numeric(10,2);
  v_discount numeric(10,2);
begin
  v_invoice_id := coalesce(new.invoice_id, old.invoice_id);

  select coalesce(sum(line_total), 0) into v_subtotal from invoice_items where invoice_id = v_invoice_id;
  select discount into v_discount from invoices where id = v_invoice_id;

  update invoices
  set subtotal = v_subtotal,
      total = greatest(v_subtotal - coalesce(v_discount, 0), 0),
      updated_at = now()
  where id = v_invoice_id;

  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists trg_invoice_items_recalc on invoice_items;
create trigger trg_invoice_items_recalc
after insert or update or delete on invoice_items
for each row execute function recalc_invoice_totals();

-- =========================================================
-- Row Level Security
-- Sistema de un solo administrador: cualquier usuario autenticado
-- (es decir, el propio administrador con su login) tiene acceso total.
-- =========================================================
alter table owners enable row level security;
alter table patients enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;
alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table payments enable row level security;

create policy "Acceso total autenticado" on owners for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on patients for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on appointments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on invoices for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on invoice_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Acceso total autenticado" on payments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- Datos de ejemplo para el catálogo de servicios (opcional)
-- =========================================================
insert into services (name, default_price, description) values
  ('Consulta general', 350, 'Revisión y diagnóstico general'),
  ('Vacuna múltiple', 450, 'Vacuna polivalente'),
  ('Desparasitación', 200, 'Interna y externa'),
  ('Baño y limpieza', 250, 'Baño medicado'),
  ('Cirugía menor', 1200, 'Procedimiento ambulatorio')
on conflict do nothing;
