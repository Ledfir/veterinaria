import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { listInvoices, getExpensesByMonth, getExpensesByCategory } from '../../lib/api';
import { formatCurrency, Loading } from '../../components/ui';

export default function FinancialReport() {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const invoiceData = await listInvoices();
        setInvoices(invoiceData);
        
        // Cargar gastos y categorías
        const [year, month] = monthFilter.split('-').map(Number);
        const expenseData = await getExpensesByMonth(month, year);
        setExpenses(expenseData || []);
        
        const categoryData = await getExpensesByCategory();
        setExpensesByCategory(categoryData || {});
      } catch (err) {
        console.error('Error loading data:', err);
      }
      setLoading(false);
    }
    load();
  }, [monthFilter]);

  if (loading) return <Loading />;

  // Filtrar facturas del mes seleccionado
  const [year, month] = monthFilter.split('-').map(Number);
  const monthInvoices = invoices.filter((inv) => {
    const invDate = new Date(inv.issue_date);
    return invDate.getFullYear() === year && invDate.getMonth() + 1 === month;
  });

  // Datos para gráfica de ingresos vs pagos
  const totalEmitido = monthInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalPagado = monthInvoices.reduce((sum, inv) => sum + Number(inv.paid_amount), 0);
  const totalPendiente = totalEmitido - totalPagado;

  // Calcular total de gastos
  const totalGastos = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Calcular ganancia neta
  const gananciaNetaIngresos = totalPagado - totalGastos;

  const statusData = [
    { name: 'Pagado', value: totalPagado, color: '#4F7A5D' },
    { name: 'Pendiente', value: totalPendiente, color: '#A63B3B' },
  ];

  // Datos para gráfica de ingresos vs gastos
  const ingresoVsGastosData = [
    { name: 'Ingresos', value: totalPagado, color: '#4F7A5D' },
    { name: 'Gastos', value: totalGastos, color: '#D97706' },
    { name: 'Ganancia Neta', value: gananciaNetaIngresos, color: '#10B981' },
  ];

  // Datos para gráfica de gastos por categoría
  const expenseCategoryData = Object.entries(expensesByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  const categoryColors = ['#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#EC4899'];

  // Datos para gráfica de ingresos por semana
  const weeklyData = getWeeklyData(monthInvoices);

  // Datos para gráfica de estado de facturas
  const statusCounts = {
    pendiente: monthInvoices.filter((inv) => inv.status === 'pendiente').length,
    confirmada: monthInvoices.filter((inv) => inv.status === 'confirmada').length,
    completada: monthInvoices.filter((inv) => inv.status === 'completada').length,
    cancelada: monthInvoices.filter((inv) => inv.status === 'cancelada').length,
  };

  const invoiceStatusData = [
    { name: 'Pendiente', value: statusCounts.pendiente, color: '#726E65' },
    { name: 'Confirmada', value: statusCounts.confirmada, color: '#1F4B43' },
    { name: 'Completada', value: statusCounts.completada, color: '#4F7A5D' },
    { name: 'Cancelada', value: statusCounts.cancelada, color: '#A63B3B' },
  ];

  const nonZeroStatus = invoiceStatusData.filter((s) => s.value > 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Finanzas</div>
          <h1>Ingresos y Egresos</h1>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="month-filter" style={{ marginRight: 12, fontWeight: 500 }}>Mes:</label>
        <input
          id="month-filter"
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Resumen de totales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="form-card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Total Ingresos</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>{formatCurrency(totalPagado)}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: 8 }}>{monthInvoices.length} factura{monthInvoices.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="form-card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Total Gastos</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#D97706' }}>{formatCurrency(totalGastos)}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: 8 }}>{expenses.length} gasto{expenses.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="form-card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Ganancia Neta</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: gananciaNetaIngresos >= 0 ? '#10B981' : '#EF4444' }}>{formatCurrency(gananciaNetaIngresos)}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
            {totalPagado > 0 ? `${((gananciaNetaIngresos / totalPagado) * 100).toFixed(0)}% margen` : 'Sin ingresos'}
          </div>
        </div>
        <div className="form-card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Pendiente de Cobrar</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#A63B3B' }}>{formatCurrency(totalPendiente)}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: 8 }}>{((totalPendiente / totalEmitido) * 100).toFixed(0)}% del emitido</div>
        </div>
      </div>

      {/* Gráficas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        {/* Gráfica de ingresos vs gastos */}
        <div className="form-card">
          <h3 style={{ marginBottom: 16 }}>Ingresos vs Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ingresoVsGastosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ingresoVsGastosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de gastos por categoría */}
        {expenseCategoryData.length > 0 && (
          <div className="form-card">
            <h3 style={{ marginBottom: 16 }}>Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfica de ingresos por semana */}
        <div className="form-card">
          <h3 style={{ marginBottom: 16 }}>Ingresos por Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="total" fill="#1F4B43" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de pagado vs pendiente */}
        <div className="form-card">
          <h3 style={{ marginBottom: 16 }}>Pagado vs Pendiente</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de estado de facturas */}
        {nonZeroStatus.length > 0 && (
          <div className="form-card">
            <h3 style={{ marginBottom: 16 }}>Estado de Facturas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nonZeroStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nonZeroStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tendencia mensual */}
      <div className="form-card">
        <h3 style={{ marginBottom: 16 }}>Tendencia de Ingresos (últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getMonthlyTrendData(invoices)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Line type="monotone" dataKey="emitido" stroke="#1F4B43" strokeWidth={2} name="Facturado" />
            <Line type="monotone" dataKey="pagado" stroke="#4F7A5D" strokeWidth={2} name="Pagado" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getWeeklyData(invoices) {
  const weeks = {};
  invoices.forEach((inv) => {
    const date = new Date(inv.issue_date);
    const weekNumber = getWeekNumber(date);
    const key = `Sem ${weekNumber}`;
    if (!weeks[key]) weeks[key] = 0;
    weeks[key] += Number(inv.total);
  });

  return Object.entries(weeks).map(([week, total]) => ({ week, total }));
}

function getMonthlyTrendData(invoices) {
  const months = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
    months[key] = { emitido: 0, pagado: 0 };
  }

  invoices.forEach((inv) => {
    const date = new Date(inv.issue_date);
    const key = date.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
    if (months[key]) {
      months[key].emitido += Number(inv.total);
      months[key].pagado += Number(inv.paid_amount);
    }
  });

  return Object.entries(months).map(([month, data]) => ({ month, ...data }));
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
