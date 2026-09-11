# VetPanel — Sistema Interno de Administración Veterinaria

Aplicación web moderna de administración para veterinarias, diseñada para gestionar de forma integral y eficiente todas las operaciones de una clínica veterinaria. Permite a veterinarios y administradores gestionar pacientes, citas, facturación y reportes financieros desde una interfaz intuitiva.

## 🎯 Características principales

### 📋 Gestión de Pacientes
- Registro completo de dueños (propietarios) con teléfono, email y dirección
- Fichas detalladas de pacientes/mascotas con datos clínicos (especie, raza, peso, fecha de nacimiento, color)
- Notas clínicas e historial de cada mascota
- Estado activo/inactivo para filtrado de pacientes

### 📅 Calendario de Citas
- Vista de calendario semanal, mensual y por día
- Gestión de citas con múltiples estados: pendiente, confirmada, completada, cancelada
- Asociación automática a paciente y dueño
- Detalles de cita con notas y motivo de consulta
- Búsqueda y filtrado de citas

### 💰 Sistema de Facturación
- Creación y edición de facturas con numeración automática
- Adición de conceptos/servicios con cantidad y precio unitario
- Descuentos configurables por factura
- **Cálculo automático de totales y saldo pendiente** mediante triggers de BD
- Control de pagos parciales (efectivo, tarjeta, transferencia)
- Estados automáticos: pendiente, parcial, pagada, vencida, cancelada
- Generación de PDF profesional con toda la información de la factura
- Historial completo de pagos recibidos

### 📊 Reportes Financieros
- Resumen de ingresos por período
- Visualización de facturas pendientes y vencidas
- Gráficos de ingresos en el tiempo
- Reporte de gastos y categorización

### ⚙️ Configuración
- Panel de configuración de usuario
- Gestión de datos de la clínica

### 🏠 Página Pública
- Landing page con información de la veterinaria
- Secciones: Hero, Servicios, Acerca de, Galería, Testimonios, Contacto
- WhatsApp flotante para contacto rápido
- Diseño responsive y moderno

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Frontend** | React | 19.2.8 |
| | Vite | 8.2.2 |
| | React Router DOM | 7.18.3 |
| **Estilos** | Tailwind CSS | 3.4.19 |
| | PostCSS | 8.5.28 |
| | Autoprefixer | 10.5.6 |
| | tailwindcss-animate | 1.0.7 |
| **Componentes UI** | Radix UI | Varios |
| | shadcn/ui | Integrado |
| | Lucide Icons | 1.42.0 |
| **Backend** | Supabase (PostgreSQL + Auth) | 2.116.0 |
| **Calendario** | react-big-calendar | 1.20.0 |
| | react-datepicker | 9.1.0 |
| **Gráficos** | Recharts | 3.10.1 |
| **PDF** | jsPDF | 4.2.1 |
| **Carrusel** | embla-carousel-react | 8.6.0 |
| **Animaciones** | Anime.js | 3.2.2 |
| **Utilidades** | date-fns | 4.4.0 |
| | tailwind-merge | 3.6.0 |
| | class-variance-authority | 0.7.1 |
| **Linting** | Oxlint | 1.79.0 |

## 📂 Estructura del Proyecto

```
vet-system/
├── public/                    # Activos estáticos
│   ├── imagenes/             # Imágenes de la landing page
│   └── favicon.ico
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Layout.jsx        # Contenedor principal con navbar
│   │   ├── ProtectedRoute.jsx # Rutas protegidas (requieren autenticación)
│   │   ├── ui.jsx            # Componentes UI base (Loading, StatusBadge, etc.)
│   │   ├── ui/               # Componentes shadcn/ui
│   │   └── vet/              # Componentes de la landing page
│   │       ├── Navbar.jsx
│   │       ├── Hero.jsx
│   │       ├── Services.jsx
│   │       ├── About.jsx
│   │       ├── Gallery.jsx
│   │       ├── Testimonials.jsx
│   │       ├── Contact.jsx
│   │       ├── Preloader.jsx
│   │       └── WhatsAppFloat.jsx
│   ├── context/              # React Context (estado global)
│   │   ├── AuthContext.jsx   # Contexto de autenticación Supabase
│   │   └── SiteConfigContext.jsx
│   ├── hooks/                # Custom hooks reutilizables
│   ├── lib/                  # Utilidades y servicios
│   │   ├── api.js           # Capa de acceso a datos (llamadas a Supabase)
│   │   └── supabaseClient.js # Configuración del cliente Supabase
│   ├── pages/               # Páginas principales
│   │   ├── Home.jsx         # Landing page pública
│   │   ├── Login.jsx        # Página de autenticación
│   │   ├── Dashboard.jsx    # Panel principal (protegido)
│   │   ├── Settings.jsx     # Configuración (protegido)
│   │   ├── appointments/    # Módulo de citas
│   │   │   ├── AppointmentsCalendar.jsx
│   │   │   └── AppointmentFormModal.jsx
│   │   ├── patients/        # Módulo de pacientes
│   │   │   ├── PatientsList.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── PatientDetail.jsx
│   │   └── billing/         # Módulo de facturación
│   │       ├── InvoicesList.jsx
│   │       ├── InvoiceForm.jsx
│   │       ├── InvoiceDetail.jsx
│   │       ├── PaymentFormModal.jsx
│   │       ├── ExpensesList.jsx
│   │       ├── ExpenseFormModal.jsx
│   │       └── FinancialReport.jsx
│   ├── styles/              # Estilos globales
│   │   └── calendar.css
│   ├── App.jsx              # Rutas principales
│   ├── index.css            # Variables CSS y estilos base
│   └── main.jsx             # Punto de entrada
├── supabase/
│   ├── schema.sql           # Esquema completo de BD con triggers y RLS
│   └── gastos_setup.sql    # Setup para módulo de gastos
├── vite.config.js           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind CSS
├── postcss.config.js        # Configuración de PostCSS
├── .env                     # Variables de entorno (no commitear)
├── package.json
├── README.md
└── index.html

```

## 🔧 Configuración Inicial

### 1. Crear el proyecto en Supabase

### 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo (plan gratuito es suficiente para empezar).
2. Una vez creado, ve a **SQL Editor** y ejecuta el contenido completo del archivo [`supabase/schema.sql`](./supabase/schema.sql). Esto crea:
   - Todas las tablas (owners, patients, appointments, invoices, invoice_items, payments, services, expenses)
   - Índices para optimizar consultas
   - Triggers automáticos que recalculan saldos, totales y estados de facturas
   - Políticas de seguridad (Row Level Security / RLS)
3. Opcionalmente, ejecuta también [`supabase/gastos_setup.sql`](./supabase/gastos_setup.sql) para el módulo de gastos.
4. Ve a **Authentication → Users** y crea un usuario manualmente (tu correo y una contraseña). Ese será el usuario administrador con el que inicias sesión en la app — no hay registro público.
5. Ve a **Project Settings → API** y copia:
   - `Project URL` (ej: `https://xxxxx.supabase.co`)
   - `anon public key` (la clave pública para el cliente)

### 2. Configurar el proyecto localmente

```bash
# Clona o descarga el proyecto
cd vet-system

# Instala dependencias (usando pnpm, npm o yarn)
pnpm install
# o: npm install
```

Crea archivo `.env` en la raíz del proyecto:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 3. Ejecutar en desarrollo

```bash
pnpm dev
# o: npm run dev
```

Abre `http://localhost:5173` (o el puerto que indique Vite), y inicia sesión con el usuario que creaste en Supabase Auth.

### 4. Compilar para producción

```bash
pnpm build
# o: npm run build
```

Esto genera la carpeta `dist/`, lista para desplegarse en cualquier hosting estático:
- **Vercel** (recomendado para proyectos Vite)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**
- Cualquier servidor web estático (Apache, Nginx, etc.)

**Importante**: Configura también las variables de entorno en tu plataforma de hosting.

## 🗄️ Modelo de Datos

### Relaciones principales

```
owners (Dueños)
  ├─ 1 → * patients (Mascotas/Pacientes)
  │        └─ 1 → * appointments (Citas)
  └─ 1 → * invoices (Facturas)
           ├─ * → * invoice_items (Conceptos de factura)
           └─ * → * payments (Pagos recibidos)

services (Catálogo de servicios)
  └─ → Referencia opcional para invoice_items
```

### Tablas principales

#### **owners** (Dueños de mascotas)
- `id`: UUID (clave primaria)
- `full_name`, `phone`, `email`, `address`: Datos de contacto
- `notes`: Notas adicionales
- `created_at`, `updated_at`: Timestamps

#### **patients** (Pacientes/Mascotas)
- `id`, `owner_id`: Referencia al dueño
- `name`: Nombre de la mascota
- `species`, `breed`: Especie (Perro, Gato, etc.) y raza
- `sex`, `birth_date`: Sexo y fecha de nacimiento
- `weight_kg`, `color`: Peso y color
- `notes`: Historial clínico
- `active`: Estado (para filtrar mascotas activas)

#### **appointments** (Citas)
- `id`, `patient_id`: Referencia al paciente
- `reason`, `notes`: Motivo de la cita y observaciones
- `start_time`, `end_time`: Fecha y hora de inicio y fin
- `status`: Pendiente, confirmada, completada, cancelada

#### **invoices** (Facturas)
- `id`, `invoice_number`: Número único de factura
- `owner_id`, `patient_id`: Referencias a dueño y paciente
- `issue_date`, `due_date`: Fecha de emisión y vencimiento
- `status`: Pendiente, parcial, pagada, vencida, cancelada (se calcula automáticamente)
- `subtotal`, `discount`, `total`: Montos (se calculan automáticamente con triggers)
- `paid_amount`: Total pagado (se actualiza al agregar pagos)
- `notes`: Notas de la factura

#### **invoice_items** (Conceptos de factura)
- `id`, `invoice_id`: Referencia a factura
- `description`, `quantity`, `unit_price`: Detalles del concepto
- `line_total`: Total de la línea (cantidad × precio unitario)

#### **payments** (Pagos recibidos)
- `id`, `invoice_id`: Referencia a factura
- `payment_date`: Fecha del pago
- `method`: Método (efectivo, tarjeta, transferencia)
- `amount`: Monto pagado
- `reference`: Referencia del pago (ej: número de comprobante)

#### **services** (Catálogo opcional de servicios)
- `id`, `name`: Nombre del servicio
- `default_price`, `description`: Precio y descripción
- `active`: Estado

#### **expenses** (Gastos operacionales)
- `id`, `date`: Fecha del gasto
- `category`, `description`: Categoría y descripción
- `amount`: Monto del gasto
- `notes`: Notas adicionales

### Cálculos automáticos (Triggers de BD)

Cuando agregas, editas o eliminas conceptos o pagos en una factura, **la base de datos recalcula automáticamente**:
- ✅ **Subtotal**: Suma de todas las líneas (cantidad × precio unitario)
- ✅ **Total**: Subtotal - Descuento
- ✅ **Paid Amount**: Suma de todos los pagos
- ✅ **Balance (Saldo)**: Total - Paid Amount
- ✅ **Status**: 
  - `pendiente` si no hay pagos
  - `parcial` si hay pagos pero aún hay saldo
  - `pagada` si el saldo es 0
  - `vencida` si la fecha de vencimiento pasó y no está pagada

**Beneficio**: No necesitas implementar estos cálculos en el frontend; ocurren automáticamente en la BD, garantizando integridad de datos.

## 🔐 Seguridad y Autenticación

- **Usuario único**: El sistema está diseñado para un administrador único. No hay registro público.
- **Autenticación**: Usa Supabase Auth (session-based con JWT tokens).
- **Row Level Security (RLS)**: Todas las tablas tienen políticas RLS que permiten acceso completo a usuarios autenticados.
- **Futura escalabilidad**: Si agregas más usuarios (recepción, veterinarios, etc.), puedes:
  1. Crear tabla `roles` con `user_id`, `role_name` (admin, vet, receptionist)
  2. Modificar políticas RLS en `schema.sql` para filtrar datos según rol
  3. Agregar validación de roles en componentes frontend (`ProtectedRoute`)

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo Vite

# Construcción
pnpm build            # Compila para producción

# Linting
pnpm lint             # Ejecuta Oxlint para verificar calidad de código

# Preview
pnpm preview          # Previsualiza la build de producción localmente
```

## 🎨 Personalización

### Colores y Tema

Los colores principales se definen en `src/index.css` usando variables CSS:

```css
:root {
  --color-bg: #fefdfb;
  --color-primary: #1f4b43;  /* Verde oscuro */
  --color-secondary: #d4a373; /* Beige/Gold */
  /* ... más variables ... */
}

.dark {
  --color-bg: #1a1a1a;
  /* ... overrides para dark mode ... */
}
```

Edita estas variables para cambiar el esquema de colores en toda la aplicación.

### Animaciones

El proyecto incluye animaciones con Anime.js (para mascota) y keyframes CSS personalizadas. Ver `src/index.css` para los keyframes disponibles.

## 📱 Responsive Design

El proyecto está completamente optimizado para dispositivos móviles, tablets y desktops usando Tailwind CSS. Prueba en diferentes resoluciones durante el desarrollo.

## 🚀 Despliegue

## 🚀 Despliegue

### Vercel (Recomendado)

1. Crea una cuenta en [vercel.com](https://vercel.com)
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Despliega (automático en cada push a main)

### Netlify

1. Crea una cuenta en [netlify.com](https://netlify.com)
2. Conecta tu repositorio
3. Configura build command: `pnpm build` o `npm run build`
4. Configura publish directory: `dist`
5. Agrega las variables de entorno en **Site settings → Environment**
6. Despliega

### Cloudflare Pages

1. Crea una cuenta en [cloudflare.com](https://cloudflare.com)
2. Conecta tu repositorio
3. Configura:
   - Build command: `pnpm build`
   - Build output directory: `dist`
4. Agrega variables de entorno
5. Despliega

## 📚 Referencia de Componentes

### Componentes globales (`ui.jsx`)

- `Loading`: Spinner de carga
- `StatusBadge`: Badge de estado (pendiente, confirmada, pagada, etc.)
- `ConfirmDialog`: Diálogo de confirmación
- `formatCurrency`: Formatea números como moneda
- `formatDate`: Formatea fechas
- `PageHeader`: Encabezado de página

### Hooks personalizados

- `useAuth()`: Acceso al contexto de autenticación
- `useNavigate()`: Navegación programática (React Router)

### Componentes shadcn/ui

Importa desde `@/components/ui/*` según necesites:
- Button, Input, Dialog, Dropdown, etc.

## 🐛 Solución de problemas

### "Module not found" para imports @/

- Verifica que `vite.config.js` tenga configurado:
  ```js
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
  ```

### Error de conexión a Supabase

- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están correctas en `.env`
- Recarga la página (`Ctrl+Shift+R` para limpiar caché)

### Las citas no aparecen en el calendario

- Verifica que existen pacientes activos (`patients.active = true`)
- Verifica que hay citas (`appointments`) asociadas a esos pacientes
- Abre la consola del navegador para ver errores de API

### Facturas con saldos incorrectos

- Este es muy raro (los cálculos son automáticos). Intenta:
  1. Recarga la página
  2. Elimina y vuelve a agregar el pago
  3. Revisa los triggers en `schema.sql`

## 📝 Notas de Desarrollo

- El proyecto usa **React 19** con las últimas características
- **Tailwind CSS 3** con utilidades personalizadas y animaciones
- **Supabase** maneja toda la lógica de datos y autenticación
- Los triggers de BD son la clave para mantener integridad de datos
- Usa **React Router v7** para SPA (Single Page Application)

## 🤝 Mejoras futuras sugeridas

1. **Modo oscuro**: Implementar toggle en Settings (ya hay variables CSS configuradas)
2. **Exportación de reportes**: Excel/PDF de reportes financieros
3. **Email automático**: Recordatorios de citas y facturas vencidas
4. **Múltiples usuarios con roles**: Expandir el sistema de autenticación
5. **Historial clínico avanzado**: Tratamientos, diagnósticos, medicamentos
6. **Gestión de inventario**: Medicinas y productos
7. **Integración de pagos**: Stripe, PayPal para pagos en línea
8. **Notificaciones en tiempo real**: WebSockets con Supabase

## 📄 Licencia

Este proyecto es de código abierto. Úsalo libremente en tu veterinaria.

---

**¿Preguntas o sugerencias?** Revisa el código, experimenta y personaliza según las necesidades de tu veterinaria.
