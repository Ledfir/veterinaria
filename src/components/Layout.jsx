import { NavLink, Outlet } from 'react-router-dom';
import { PawPrint, LayoutGrid, Users, CalendarDays, Receipt, TrendingUp, DollarSign, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/app', label: 'Panel', icon: LayoutGrid, end: true },
  { to: '/app/pacientes', label: 'Pacientes', icon: Users },
  { to: '/app/citas', label: 'Citas', icon: CalendarDays },
  { to: '/app/facturacion', label: 'Facturación', icon: Receipt },
  { to: '/app/gastos', label: 'Gastos', icon: DollarSign },
  { to: '/app/reportes/finanzas', label: 'Reportes', icon: TrendingUp },
  { to: '/app/configuracion', label: 'Configuración', icon: Settings },
];

export default function Layout() {
  const { signOut, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <PawPrint size={22} strokeWidth={2} />
          <div>
            <div className="mark">VetPanel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-signout" style={{ marginBottom: 10, fontSize: '0.78rem', wordBreak: 'break-all' }}>
            {user?.email}
          </div>
          <button className="sidebar-link sidebar-signout" onClick={signOut} style={{ padding: '8px 12px' }}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
