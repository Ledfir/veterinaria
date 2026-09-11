import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { listOwners, listPatients, listServices, createInvoiceWithItems } from '../../lib/api';
import { formatCurrency } from '../../components/ui';

function emptyItem() {
  return { id: Math.random().toString(36).slice(2), description: '', quantity: 1, unit_price: 0 };
}

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetPatientId = params.get('patient');

  const [owners, setOwners] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  const [ownerId, setOwnerId] = useState('');
  const [patientId, setPatientId] = useState(presetPatientId || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([emptyItem()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([listOwners(), listPatients(), listServices()]).then(([o, p, s]) => {
      setOwners(o); setPatients(p); setServices(s);
      if (presetPatientId) {
        const pat = p.find((x) => x.id === presetPatientId);
        if (pat) setOwnerId(pat.owner_id || pat.owner?.id);
      }
    });
  }, [presetPatientId]);

  const patientsForOwner = patients.filter((p) => p.owner_id === ownerId || p.owner?.id === ownerId);

  function updateItem(id, field, value) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addItem() { setItems((prev) => [...prev, emptyItem()]); }
  function removeItem(id) { setItems((prev) => prev.filter((it) => it.id !== id)); }

  function applyService(id, serviceId) {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, description: svc.name, unit_price: svc.default_price } : it)));
  }

  const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
  const total = Math.max(subtotal - Number(discount || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!ownerId) { setError('Selecciona el dueño que recibe la factura.'); return; }
    const validItems = items.filter((it) => it.description.trim());
    if (validItems.length === 0) { setError('Agrega al menos un concepto.'); return; }

    setSaving(true);
    try {
      const invoice = await createInvoiceWithItems({
        header: {
          owner_id: ownerId,
          patient_id: patientId || null,
          issue_date: issueDate,
          due_date: dueDate || null,
          discount: Number(discount || 0),
          notes,
        },
        items: validItems.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity),
          unit_price: Number(it.unit_price),
        })),
      });
      navigate(`/facturacion/${invoice.id}`);
    } catch (err) {
      setError(err.message || 'No se pudo crear la factura.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link className="back-link" to="/app/facturacion">← Facturación</Link>
      <div className="page-header"><h1>Nueva factura</h1></div>

      <form className="form-card" style={{ maxWidth: 720 }} onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>Dueño</label>
            <select value={ownerId} onChange={(e) => { setOwnerId(e.target.value); setPatientId(''); }} required>
              <option value="">— Selecciona —</option>
              {owners.map((o) => <option key={o.id} value={o.id}>{o.full_name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Paciente (opcional)</label>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">— General —</option>
              {patientsForOwner.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Fecha de emisión</label>
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
          </div>
          <div className="field">
            <label>Fecha de vencimiento (opcional)</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        <div className="section-title">
          <h3>Conceptos</h3>
          <button type="button" className="btn btn-secondary" onClick={addItem}><Plus size={14} /> Agregar concepto</button>
        </div>

        {items.map((it) => (
          <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 30px', gap: 10, marginBottom: 10, alignItems: 'center' }}>
            <div>
              <input
                placeholder="Descripción"
                value={it.description}
                onChange={(e) => updateItem(it.id, 'description', e.target.value)}
                list={`services-${it.id}`}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 4 }}
              />
              <datalist id={`services-${it.id}`}>
                {services.map((s) => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
            <input
              type="number" min="0" step="1" value={it.quantity}
              onChange={(e) => updateItem(it.id, 'quantity', e.target.value)}
              style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 4 }}
            />
            <input
              type="number" min="0" step="0.01" value={it.unit_price}
              onChange={(e) => updateItem(it.id, 'unit_price', e.target.value)}
              onFocus={() => { const svc = services.find((s) => s.name === it.description); if (svc) applyService(it.id, svc.id); }}
              style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 4 }}
            />
            <button type="button" className="btn-ghost" onClick={() => removeItem(it.id)}><Trash2 size={15} /></button>
          </div>
        ))}

        <div className="divider" />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 260 }}>
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            <div className="field" style={{ margin: '10px 0' }}>
              <label>Descuento</label>
              <input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <SummaryRow label="Total" value={formatCurrency(total)} bold />
          </div>
        </div>

        <div className="field">
          <label>Notas</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Crear factura'}
        </button>
      </form>
    </div>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: bold ? 700 : 400, fontSize: bold ? '1.05rem' : '0.9rem', padding: '4px 0' }}>
      <span style={{ color: bold ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
