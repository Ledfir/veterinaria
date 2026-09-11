import { useState } from 'react';
import { Modal, formatCurrency } from '../../components/ui';
import { addPayment } from '../../lib/api';

export default function PaymentFormModal({ invoiceId, balance, onClose, onSaved }) {
  const [amount, setAmount] = useState(balance);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('efectivo');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (Number(amount) <= 0) { setError('El monto debe ser mayor a cero.'); return; }
    setSaving(true);
    try {
      await addPayment({
        invoice_id: invoiceId,
        amount: Number(amount),
        payment_date: paymentDate,
        method,
        reference,
      });
      onSaved();
    } catch (err) {
      setError(err.message || 'No se pudo registrar el pago.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Registrar pago" onClose={onClose} width="400px">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Saldo pendiente: <strong style={{ color: 'var(--color-text)' }}>{formatCurrency(balance)}</strong>
        </p>

        <div className="field">
          <label>Monto</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Fecha</label>
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
          </div>
          <div className="field">
            <label>Método</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Referencia (opcional)</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Núm. de autorización, folio…" />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Registrar pago'}</button>
        </div>
      </form>
    </Modal>
  );
}
