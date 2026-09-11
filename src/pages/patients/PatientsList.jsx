import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { listPatients } from '../../lib/api';
import { Loading, EmptyState } from '../../components/ui';

export default function PatientsList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    listPatients().then(setPatients);
  }, []);

  const filtered = useMemo(() => {
    if (!patients) return [];
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.owner?.full_name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q)
    );
  }, [patients, query]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Registro clínico</div>
          <h1>Pacientes</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/pacientes/nuevo')}>
          <Plus size={16} /> Nuevo paciente
        </button>
      </div>

      <div className="field" style={{ maxWidth: 320, marginBottom: 22 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: 'var(--color-text-muted)' }} />
          <input
            placeholder="Buscar por paciente, dueño o especie…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 32, width: '100%', border: '1px solid var(--color-border)', borderRadius: 4, padding: '9px 11px 9px 32px' }}
          />
        </div>
      </div>

      {patients === null && <Loading />}

      {patients !== null && filtered.length === 0 && (
        <EmptyState
          title="Sin pacientes todavía"
          message="Registra tu primer paciente para comenzar a llevar su historial."
          action={<button className="btn btn-primary" onClick={() => navigate('/app/pacientes/nuevo')}><Plus size={16} /> Nuevo paciente</button>}
        />
      )}

      {patients !== null && filtered.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Especie / raza</th>
              <th>Dueño</th>
              <th>Teléfono</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} onClick={() => navigate(`/app/pacientes/${p.id}`)}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {p.photo_url && (
                    <img 
                      src={p.photo_url} 
                      alt={p.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </td>
                <td>{p.species}{p.breed ? ` · ${p.breed}` : ''}</td>
                <td>{p.owner?.full_name}</td>
                <td>{p.owner?.phone || '—'}</td>
                <td>{p.active ? <span className="badge badge-success">Activo</span> : <span className="badge badge-neutral">Inactivo</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
