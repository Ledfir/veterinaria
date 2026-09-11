import { X } from 'lucide-react';

export function StatusBadge({ status }) {
  const map = {
    pendiente: { cls: 'badge-neutral', text: 'Pendiente' },
    confirmada: { cls: 'badge-success', text: 'Confirmada' },
    completada: { cls: 'badge-success', text: 'Completada' },
    cancelada: { cls: 'badge-danger', text: 'Cancelada' },
    parcial: { cls: 'badge-warning', text: 'Pago parcial' },
    pagada: { cls: 'badge-success', text: 'Pagada' },
    vencida: { cls: 'badge-danger', text: 'Vencida' },
  };
  const item = map[status] || { cls: 'badge-neutral', text: status };
  return <span className={`badge ${item.cls}`}>{item.text}</span>;
}

export function Modal({ title, onClose, children, width }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        style={width ? { maxWidth: width } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3>{title}</h3>
          <button className="btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = 'Eliminar', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} width="380px">
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 22 }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary" style={{ background: 'var(--color-danger)' }} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Loading({ label = 'Cargando…' }) {
  return <p style={{ color: 'var(--color-text-muted)', padding: '30px 0' }}>{label}</p>;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
}

export function formatDate(value, opts) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-MX', opts || { day: '2-digit', month: 'short', year: 'numeric' });
}
