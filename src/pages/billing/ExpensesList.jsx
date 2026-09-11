import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { listExpenses, deleteExpense } from '../../lib/api';
import { formatCurrency, formatDate, Loading, EmptyState, ConfirmDialog } from '../../components/ui';
import ExpenseFormModal from './ExpenseFormModal';

export default function ExpensesList() {
  const [expenses, setExpenses] = useState(null);
  const [monthFilter, setMonthFilter] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    try {
      const data = await listExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!expenses) return [];
    const [year, month] = monthFilter.split('-');
    return expenses.filter((exp) => {
      const expDate = exp.expense_date.slice(0, 7);
      return expDate === monthFilter;
    });
  }, [expenses, monthFilter]);

  const totals = useMemo(() => {
    const totalAmount = filtered.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const byCategory = {};
    filtered.forEach((exp) => {
      if (!byCategory[exp.category]) byCategory[exp.category] = 0;
      byCategory[exp.category] += Number(exp.amount);
    });
    return { totalAmount, byCategory };
  }, [filtered]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteExpense(confirmDelete.id);
      setConfirmDelete(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingExpense(null);
  };

  const handleSaved = () => {
    handleModalClose();
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Contabilidad</div>
          <h1>Gastos</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nuevo gasto
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <div className="field" style={{ maxWidth: 200, marginBottom: 0 }}>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="stat-strip" style={{ marginBottom: 24 }}>
        <div className="stat-block">
          <div className="value">{formatCurrency(totals.totalAmount)}</div>
          <div className="label">Gasto total del mes</div>
        </div>
        <div className="stat-block">
          <div className="value">{filtered.length}</div>
          <div className="label">Registros del mes</div>
        </div>
      </div>

      {totals.totalAmount > 0 && (
        <div className="form-card" style={{ marginBottom: 24, padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Gasto por categoría</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(totals.byCategory).map(([category, amount]) => (
              <div key={category} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{category}</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {expenses === null && <Loading />}

      {expenses !== null && filtered.length === 0 && (
        <EmptyState
          title="Sin gastos"
          message="No hay gastos registrados para este período."
          action={<button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo gasto</button>}
        />
      )}

      {expenses !== null && filtered.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th style={{ textAlign: 'right' }}>Monto</th>
              <th style={{ textAlign: 'center', width: 80 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp) => (
              <tr key={exp.id}>
                <td>{formatDate(exp.expense_date)}</td>
                <td>{exp.description}</td>
                <td>
                  <span className="badge badge-neutral">{exp.category}</span>
                </td>
                <td>{exp.provider || '—'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(exp.amount)}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <button
                      className="btn btn-icon btn-secondary"
                      onClick={() => handleEdit(exp)}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-icon btn-danger"
                      onClick={() => setConfirmDelete(exp)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <ExpenseFormModal
          expense={editingExpense}
          onClose={handleModalClose}
          onSaved={handleSaved}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar gasto"
          message={`¿Eliminar este gasto de ${formatCurrency(confirmDelete.amount)}?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
