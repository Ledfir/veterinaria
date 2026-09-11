-- Crear tabla de gastos
CREATE TABLE expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  provider TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);

-- Habilitar RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS para usuarios autenticados
CREATE POLICY "usuarios_ver_gastos" ON expenses
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "usuarios_crear_gastos" ON expenses
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "usuarios_actualizar_gastos" ON expenses
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "usuarios_eliminar_gastos" ON expenses
FOR DELETE
USING (auth.role() = 'authenticated');

-- Crear categorías de ejemplo como tabla de referencia (opcional)
CREATE TABLE expense_categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280'
);

-- Insertar categorías por defecto
INSERT INTO expense_categories (name) VALUES
  ('Suministros'),
  ('Servicios'),
  ('Arriendo'),
  ('Electricidad'),
  ('Agua'),
  ('Internet'),
  ('Teléfono'),
  ('Mantenimiento'),
  ('Publicidad'),
  ('Impuestos'),
  ('Otros');
