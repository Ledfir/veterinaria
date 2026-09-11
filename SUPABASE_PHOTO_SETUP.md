# Configuración de Fotos de Pacientes en Supabase

## Pasos necesarios para activar la funcionalidad de fotos:

### 1. Crear Storage Bucket

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. En el menú lateral, selecciona **Storage**
3. Haz clic en **Create a new bucket**
4. Completa los datos:
   - **Bucket name**: `patient-photos`
   - **Private bucket**: Desactiva esta opción (debe ser público)
5. Haz clic en **Create bucket**

### 2. Agregar columna a la tabla `patients`

1. En Supabase Dashboard, ve a **SQL Editor**
2. Crea una nueva query y ejecuta:

```sql
ALTER TABLE patients ADD COLUMN photo_url TEXT DEFAULT NULL;
```

### 3. Configurar políticas de seguridad (RLS)

Si la tabla `patients` tiene RLS habilitado y ves el error "new row violates row-level security policy", ejecuta estas políticas en **SQL Editor**:

```sql
-- Política para SELECT: usuarios autenticados pueden ver pacientes
CREATE POLICY "usuarios_ver_pacientes" ON patients
FOR SELECT
USING (auth.role() = 'authenticated');

-- Política para INSERT: usuarios autenticados pueden crear pacientes
CREATE POLICY "usuarios_crear_pacientes" ON patients
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE: usuarios autenticados pueden actualizar pacientes
CREATE POLICY "usuarios_actualizar_pacientes" ON patients
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Política para DELETE: usuarios autenticados pueden eliminar pacientes
CREATE POLICY "usuarios_eliminar_pacientes" ON patients
FOR DELETE
USING (auth.role() = 'authenticated');
```

**Alternativa**: Si prefieres permitir todo sin restricciones de usuario (menos seguro pero más simple):

```sql
-- Habilitar RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Política permisiva para todas las operaciones
CREATE POLICY "permitir_todo" ON patients
FOR ALL
USING (true)
WITH CHECK (true);
```

### 4. Configurar política para Storage (Opcional)

### 4. Configurar política para Storage (Opcional)

Para mayor seguridad en el bucket `patient-photos`, ve a:
1. **Storage** → **patient-photos** → **Policies**
2. Crea una política para permitir uploads autenticados:

```sql
-- Permitir que usuarios autenticados suban archivos
CREATE POLICY "Permitir upload autenticado"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'patient-photos');

-- Permitir que usuarios autenticados vean archivos
CREATE POLICY "Permitir lectura pública"
ON storage.objects
FOR SELECT
USING (bucket_id = 'patient-photos');
```

## ✅ Checklist de configuración:

- [ ] Crear bucket `patient-photos` (público)
- [ ] Agregar columna `photo_url` a tabla `patients`
- [ ] Ejecutar políticas de RLS para tabla `patients`
- [ ] (Opcional) Configurar políticas de Storage

## Ya está listo 🎉

Ahora puedes:
- Agregar fotos al crear un nuevo paciente
- Editar la foto de un paciente existente
- Ver la foto en la página de detalles del paciente

Las fotos se almacenan en Supabase Storage y se pueden acceder públicamente desde cualquier lugar.
