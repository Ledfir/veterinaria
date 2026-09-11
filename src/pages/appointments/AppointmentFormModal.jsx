import { useEffect, useState, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from '../../components/ui';
import { listPatients, createAppointment, updateAppointment, deleteAppointment } from '../../lib/api';
import { ChevronDown } from 'lucide-react';

registerLocale('es', es);

export default function AppointmentFormModal({ appointment, defaultPatientId, defaultStart, defaultEnd, onClose, onSaved, onDeleted }) {
  const isEdit = Boolean(appointment);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  function addMinutes(base, mins) {
    const d = base ? new Date(base) : new Date();
    d.setMinutes(d.getMinutes() + mins);
    return d;
  }

  const [form, setForm] = useState({
    patient_id: appointment?.patient_id || defaultPatientId || '',
    reason: appointment?.reason || '',
    start_time: appointment?.start_time ? new Date(appointment.start_time) : defaultStart || new Date(),
    end_time: appointment?.end_time ? new Date(appointment.end_time) : defaultEnd || addMinutes(defaultStart, 30),
    status: appointment?.status || 'pendiente',
    notes: appointment?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { listPatients().then(setPatients); }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPatient = patients.find((p) => p.id === form.patient_id);
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function update(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.patient_id) { setError('Selecciona un paciente.'); return; }
    setSaving(true);
    try {
      const payload = {
        patient_id: form.patient_id,
        reason: form.reason,
        start_time: form.start_time.toISOString(),
        end_time: form.end_time.toISOString(),
        status: form.status,
        notes: form.notes,
      };
      if (isEdit) await updateAppointment(appointment.id, payload);
      else await createAppointment(payload);
      onSaved();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la cita.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    await deleteAppointment(appointment.id);
    onDeleted ? onDeleted() : onSaved();
  }

  return (
    <Modal title={isEdit ? 'Editar cita' : 'Nueva cita'} onClose={onClose} width="460px">
      <form onSubmit={handleSubmit}>
        <div className="field" ref={dropdownRef} style={{ position: 'relative' }}>
          <label>Paciente</label>
          <div
            onClick={() => !defaultPatientId && setOpenDropdown(!openDropdown)}
            style={{
              padding: '9px 11px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-surface)',
              cursor: defaultPatientId ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: defaultPatientId ? 0.6 : 1,
            }}
          >
            <span style={{ color: form.patient_id ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {selectedPatient ? `${selectedPatient.name} (${selectedPatient.owner?.full_name})` : '— Selecciona —'}
            </span>
            <ChevronDown size={16} />
          </div>
          {openDropdown && !defaultPatientId && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: 4,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-surface)',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <input
                type="text"
                placeholder="Buscar paciente…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 11px',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                }}
              />
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, patient_id: p.id }));
                        setOpenDropdown(false);
                        setSearchTerm('');
                      }}
                      style={{
                        padding: '10px 11px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = 'rgba(31,75,67,0.05)')}
                      onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                    >
                      {p.name} ({p.owner?.full_name})
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '10px 11px', color: 'var(--color-text-muted)' }}>No hay pacientes</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="field">
          <label>Motivo</label>
          <input name="reason" value={form.reason} onChange={update} required placeholder="Ej. Consulta, vacunación…" />
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Inicio</label>
            <DatePicker
              selected={form.start_time}
              onChange={(date) => setForm((prev) => ({ ...prev, start_time: date }))}
              showTimeSelect
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale="es"
              placeholderText="Selecciona fecha y hora"
              style={{ minWidth: 0 }}
              wrapperClassName="datepicker-wrapper"
              className="datepicker-input"
            />
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Fin</label>
            <DatePicker
              selected={form.end_time}
              onChange={(date) => setForm((prev) => ({ ...prev, end_time: date }))}
              showTimeSelect
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale="es"
              placeholderText="Selecciona fecha y hora"
              style={{ minWidth: 0 }}
              wrapperClassName="datepicker-wrapper"
              className="datepicker-input"
            />
          </div>
        </div>

        <div className="field">
          <label>Estado</label>
          <select name="status" value={form.status} onChange={update}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div className="field">
          <label>Notas</label>
          <textarea name="notes" rows={2} value={form.notes} onChange={update} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {isEdit ? (
            <button type="button" className="btn btn-ghost btn-danger" onClick={handleDelete} disabled={saving}>Eliminar</button>
          ) : <span />}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
