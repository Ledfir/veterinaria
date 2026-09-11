import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, User } from 'lucide-react';
import { getPatient, deletePatient, listAppointmentsForPatient, listInvoicesForPatient } from '../../lib/api';
import { StatusBadge, ConfirmDialog, formatCurrency, formatDate, Loading } from '../../components/ui';
import AppointmentFormModal from '../appointments/AppointmentFormModal';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApptModal, setShowApptModal] = useState(false);

  async function load() {
    const [p, a, inv] = await Promise.all([
      getPatient(id),
      listAppointmentsForPatient(id),
      listInvoicesForPatient(id),
    ]);
    setPatient(p);
    setAppointments(a);
    setInvoices(inv);
  }

  useEffect(() => { load(); }, [id]);

  if (!patient) return <Loading />;

  async function handleDelete() {
    await deletePatient(id);
    navigate('/app/pacientes');
  }

  return (
    <div>
      <Link className="back-link" to="/app/pacientes">← Pacientes</Link>

      <div className="page-header">
        <div>
          <div className="eyebrow">{patient.species}{patient.breed ? ` · ${patient.breed}` : ''}</div>
          <h1>{patient.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/app/pacientes/${id}/editar`)}><Pencil size={15} /> Editar</button>
          <button className="btn btn-ghost btn-danger" onClick={() => setConfirmDelete(true)}><Trash2 size={15} /></button>
        </div>
      </div>

      {/* Tarjeta principal del paciente */}
      <div className="form-card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Foto del paciente */}
          <div style={{ textAlign: 'center' }}>
            {patient.photo_url ? (
              <img 
                src={patient.photo_url} 
                alt={patient.name}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--color-border)'
                }}
              />
            ) : (
              <div style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--color-border)'
              }}>
                <User size={48} color="var(--color-text-muted)" />
              </div>
            )}
          </div>

          {/* Datos del paciente */}
          <div>
            {/* Iconos de atributos */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>♂ Sexo</span>
                <span style={{ fontWeight: 600 }}>{patient.sex}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>📅 Edad</span>
                <span style={{ fontWeight: 600 }}>{formatDate(patient.birth_date)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>⚖️ Peso</span>
                <span style={{ fontWeight: 600 }}>{patient.weight_kg ? `${patient.weight_kg} kg` : '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>🎨 Color</span>
                <span style={{ fontWeight: 600 }}>{patient.color || '—'}</span>
              </div>
            </div>

            {/* Dueño */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 8, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Dueño</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.95rem' }}>
                <div><strong>{patient.owner?.full_name}</strong></div>
                <div style={{ color: 'var(--color-text-muted)' }}>📞 {patient.owner?.phone || '—'}</div>
                <div style={{ color: 'var(--color-text-muted)' }}>✉️ {patient.owner?.email || '—'}</div>
              </div>
            </div>

            {/* Notas clínicas */}
            {patient.notes && (
              <div style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: '0.9rem' }}>Notas clínicas: </strong>
                <span style={{ fontSize: '0.9rem' }}>{patient.notes}</span>
              </div>
            )}

            {/* Saldo pendiente */}
            {invoices && invoices.length > 0 && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '10px 12px',
                borderRadius: 4,
                fontSize: '0.95rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                Saldo pendiente: {formatCurrency(invoices.reduce((sum, inv) => sum + (inv.total - inv.paid_amount), 0))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dos tarjetas lado a lado */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Historial de citas */}
        <div>
          <div className="section-title" style={{ marginBottom: 16 }}>
            <h3>Historial de citas</h3>
            <button className="btn btn-secondary" onClick={() => setShowApptModal(true)}><Plus size={15} /> Nueva</button>
          </div>
          {appointments.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sin citas registradas.</p>
          ) : (
            <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table" style={{ marginBottom: 0 }}>
                <thead><tr><th>Fecha</th><th>Motivo</th><th>Estado</th></tr></thead>
                <tbody>
                  {appointments.slice(0, 3).map((a) => (
                    <tr key={a.id} style={{ fontSize: '0.9rem' }}>
                      <td>{formatDate(a.start_time, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.reason}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Historial de facturación */}
        <div>
          <div className="section-title" style={{ marginBottom: 16 }}>
            <h3>Historial de facturación</h3>
            <button className="btn btn-secondary" onClick={() => navigate(`/app/facturacion/nueva?patient=${id}`)}><Plus size={15} /> Nueva</button>
          </div>
          {invoices.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sin facturas registradas.</p>
          ) : (
            <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table" style={{ marginBottom: 0 }}>
                <thead><tr><th>Folio</th><th>Total</th><th>Saldo</th><th>Estado</th></tr></thead>
                <tbody>
                  {invoices.slice(0, 3).map((inv) => (
                    <tr key={inv.id} onClick={() => navigate(`/app/facturacion/${inv.id}`)} style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                      <td>{inv.invoice_number}</td>
                      <td>{formatCurrency(inv.total)}</td>
                      <td>{formatCurrency(inv.total - inv.paid_amount)}</td>
                      <td><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar paciente"
          message={`¿Eliminar a ${patient.name}? También se eliminarán sus citas asociadas.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {showApptModal && (
        <AppointmentFormModal
          defaultPatientId={id}
          onClose={() => setShowApptModal(false)}
          onSaved={() => { setShowApptModal(false); load(); }}
        />
      )}
    </div>
  );
}
