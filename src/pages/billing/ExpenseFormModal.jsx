import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createExpense, updateExpense, listExpenseCategories } from '../../lib/api';
import { formatDate } from '../../components/ui';

export default function ExpenseFormModal({ expense, onClose, onSaved }) {
  const [form, setForm] = useState({
    description: '',
    category: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    provider: '',
    notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listExpenseCategories().then(setCategories).catch(console.error);
    if (expense) {
      setForm({
        description: expense.description,
        category: expense.category,
        amount: String(expense.amount),
        expense_date: expense.expense_date,
        provider: expense.provider || '',
        notes: expense.notes || '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!form.description.trim() || !form.category || !form.amount) {
        setError('Completa los campos requeridos (descripción, categoría, monto)');
        setLoading(false);
        return;
      }

      const payload = {
        description: form.description.trim(),
        category: form.category,
        amount: Number(form.amount),
        expense_date: form.expense_date,
        provider: form.provider.trim() || null,
        notes: form.notes.trim() || null,
      };

      if (expense) {
        await updateExpense(expense.id, payload);
      } else {
        await createExpense(payload);
      }

      setLoading(false);
      onSaved();
    } catch (err) {
      setError(err.message || 'Error al guardar el gasto');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{expense ? 'Editar gasto' : 'Nuevo gasto'}</h2>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 4, fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div className="field">
            <label>Descripción del gasto *</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ej: Jeringas, atención médica..."
              required
            />
          </div>

          <div className="field">
            <label>Categoría *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Monto ($) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="field">
              <label>Fecha *</label>
              <input type="date" name="expense_date" value={form.expense_date} onChange={handleChange} required />
            </div>
          </div>

          <div className="field">
            <label>Proveedor (Opcional)</label>
            <input type="text" name="provider" value={form.provider} onChange={handleChange} placeholder="Ej: Farmacéutica XYZ..." />
          </div>

          <div className="field">
            <label>Notas (Opcional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Detalles adicionales..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
