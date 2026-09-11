import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { listInvoices } from '../../lib/api';
import { StatusBadge, formatCurrency, formatDate, Loading, EmptyState } from '../../components/ui';

const filters = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'parcial', label: 'Pago parcial' },
  { key: 'pagada', label: 'Pagadas' },
  { key: 'vencida', label: 'Vencidas' },
];

export default function InvoicesList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState(null);
  const [filter, setFilter] = useState('todas');

  useEffect(() => { listInvoices().then(setInvoices); }, []);

  const filtered = useMemo(() => {
    if (!invoices) return [];
    if (filter === 'todas') return invoices;
    return invoices.filter((i) => i.status === filter);
  }, [invoices, filter]);

  const totals = useMemo(() => {
    if (!invoices) return { outstanding: 0, monthCollected: 0 };
    const outstanding = invoices
      .filter((i) => ['pendiente', 'parcial', 'vencida'].includes(i.status))
      .reduce((s, i) => s + Number(i.total) - Number(i.paid_amount), 0);
    return { outstanding };
  }, [invoices]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Contabilidad</div>
          <h1>Facturación</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/facturacion/nueva')}>
          <Plus size={16} /> Nueva factura
        </button>
      </div>

      <div className="stat-strip">
        <div className="stat-block">
          <div className="value">{formatCurrency(totals.outstanding)}</div>
          <div className="label">Saldo por cobrar</div>
        </div>
        <div className="stat-block">
          <div className="value">{invoices ? invoices.filter((i) => i.status === 'vencida').length : '—'}</div>
          <div className="label">Facturas vencidas</div>
        </div>
        <div className="stat-block">
          <div className="value">{invoices ? invoices.length : '—'}</div>
          <div className="label">Facturas totales</div>
        </div>
      </div>

      <div className="tag-row" style={{ marginBottom: 20 }}>
        {filters.map((f) => (
          <button
            key={f.key}
            className={`btn ${filter === f.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {invoices === null && <Loading />}

      {invoices !== null && filtered.length === 0 && (
        <EmptyState title="Sin facturas" message="No hay facturas que coincidan con este filtro." />
      )}

      {invoices !== null && filtered.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Folio</th><th>Dueño</th><th>Paciente</th><th>Fecha</th><th>Total</th><th>Saldo</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} onClick={() => navigate(`/app/facturacion/${inv.id}`)}>
                <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                <td>{inv.owner?.full_name}</td>
                <td>{inv.patient?.name || '—'}</td>
                <td>{formatDate(inv.issue_date)}</td>
                <td>{formatCurrency(inv.total)}</td>
                <td>{formatCurrency(inv.total - inv.paid_amount)}</td>
                <td><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
