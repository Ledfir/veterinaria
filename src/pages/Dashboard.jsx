import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardStats } from '../lib/api';
import { formatCurrency, formatDate, Loading } from '../components/ui';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { dashboardStats().then(setStats); }, []);

  if (!stats) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1>Panel general</h1>
        </div>
      </div>

      <div className="stat-strip">
        <div className="stat-block">
          <div className="value">{stats.patientsCount}</div>
          <div className="label">Pacientes activos</div>
        </div>
        <div className="stat-block">
          <div className="value">{stats.todayAppointments.length}</div>
          <div className="label">Citas de hoy</div>
        </div>
        <div className="stat-block">
          <div className="value">{formatCurrency(stats.outstanding)}</div>
          <div className="label">Por cobrar</div>
        </div>
        <div className="stat-block">
          <div className="value">{formatCurrency(stats.monthTotal)}</div>
          <div className="label">Cobrado este mes</div>
        </div>
      </div>

      <div className="section-title">
        <h2>Agenda de hoy</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/app/citas')}>Ver calendario completo</button>
      </div>

      {stats.todayAppointments.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No hay citas programadas para hoy.</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>Hora</th><th>Paciente</th><th>Motivo</th></tr></thead>
          <tbody>
            {stats.todayAppointments.map((a) => (
              <tr key={a.id} onClick={() => navigate('/app/citas')}>
                <td>{formatDate(a.start_time, { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{a.patient?.name}</td>
                <td>{a.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
