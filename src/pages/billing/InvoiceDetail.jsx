import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { getInvoice, deleteInvoice, deletePayment } from '../../lib/api';
import { StatusBadge, ConfirmDialog, formatCurrency, formatDate, Loading } from '../../components/ui';
import PaymentFormModal from './PaymentFormModal';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPaymentId, setConfirmPaymentId] = useState(null);

  async function load() {
    const inv = await getInvoice(id);
    setInvoice(inv);
  }
  useEffect(() => { load(); }, [id]);

  if (!invoice) return <Loading />;

  const balance = Number(invoice.total) - Number(invoice.paid_amount);

  async function handleDeleteInvoice() {
    await deleteInvoice(id);
    navigate('/facturacion');
  }

  async function handleDeletePayment() {
    await deletePayment(confirmPaymentId);
    setConfirmPaymentId(null);
    load();
  }

  function generatePDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 15;
    const margin = 15;
    const halfWidth = (pageWidth - margin * 3) / 2;

    // Header: VetPanel y Factura
    doc.setFontSize(24);
    doc.setTextColor(31, 75, 67);
    doc.text('VetPanel', margin, yPos);
    
    doc.setFontSize(9);
    doc.setTextColor(114, 110, 101);
    doc.text('Comprobante de pago', margin, yPos + 6);

    // Factura número a la derecha
    doc.setFontSize(12);
    doc.setTextColor(114, 110, 101);
    doc.text('FACTURA', pageWidth - margin, yPos, { align: 'right' });
    
    doc.setFontSize(18);
    doc.setTextColor(31, 75, 67);
    doc.setFont(undefined, 'bold');
    doc.text(`F-${invoice.invoice_number}`, pageWidth - margin, yPos + 7, { align: 'right' });
    doc.setFont(undefined, 'normal');

    // Status badge
    doc.setFontSize(9);
    doc.setTextColor(76, 175, 80);
    const statusText = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);
    doc.text(statusText, pageWidth - margin, yPos + 14, { align: 'right' });

    yPos += 22;

    // Línea separadora
    doc.setDrawColor(31, 75, 67);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Dos columnas: Cliente y Detalles de factura
    const colHeight = 30;

    // Columna 1: Cliente
    doc.setFontSize(11);
    doc.setTextColor(31, 75, 67);
    doc.setFont(undefined, 'bold');
    doc.text('Cliente', margin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 6;

    doc.setFontSize(9);
    doc.setTextColor(43, 43, 40);
    const clientData = [
      ['Propietario', invoice.owner?.full_name || 'N/A'],
      ['Paciente', invoice.patient?.name || 'General'],
      ['Teléfono', invoice.owner?.phone || 'N/A'],
      ['Correo', invoice.owner?.email || 'N/A'],
    ];

    clientData.forEach(([label, value]) => {
      doc.setTextColor(114, 110, 101);
      doc.setFont(undefined, 'bold');
      doc.text(label, margin, yPos);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(43, 43, 40);
      doc.text(value, margin + 35, yPos);
      yPos += 5;
    });

    // Columna 2: Detalles factura (misma altura)
    let detailsYPos = yPos - 26;
    doc.setFontSize(11);
    doc.setTextColor(31, 75, 67);
    doc.setFont(undefined, 'bold');
    doc.text('Detalles de la factura', margin + halfWidth + margin, detailsYPos);
    doc.setFont(undefined, 'normal');
    detailsYPos += 6;

    doc.setFontSize(9);
    const detailsData = [
      ['Fecha de emisión', formatDate(invoice.issue_date)],
      ['Fecha de vencimiento', invoice.due_date ? formatDate(invoice.due_date) : '—'],
      ['Estado', invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)],
    ];

    detailsData.forEach(([label, value]) => {
      doc.setTextColor(114, 110, 101);
      doc.setFont(undefined, 'bold');
      doc.text(label, margin + halfWidth + margin, detailsYPos);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(43, 43, 40);
      doc.text(value, pageWidth - margin, detailsYPos, { align: 'right' });
      detailsYPos += 5;
    });

    yPos += 22;

    // Conceptos
    if (invoice.items.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(31, 75, 67);
      doc.setFont(undefined, 'bold');
      doc.text('Conceptos', margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 6;

      // Header tabla
      doc.setFontSize(8);
      doc.setTextColor(114, 110, 101);
      doc.setFont(undefined, 'bold');
      doc.text('DESCRIPCIÓN', margin, yPos);
      doc.text('CANT.', 90, yPos);
      doc.text('PRECIO UNIT.', 120, yPos);
      doc.text('IMPORTE', 165, yPos, { align: 'right' });
      doc.setFont(undefined, 'normal');
      yPos += 1;

      // Línea
      doc.setDrawColor(228, 223, 211);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;

      // Items
      doc.setFontSize(9);
      doc.setTextColor(43, 43, 40);
      invoice.items.forEach((item) => {
        if (yPos > pageHeight - 35) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(item.description, margin, yPos);
        doc.text(String(item.quantity), 90, yPos, { align: 'center' });
        doc.text(formatCurrency(item.unit_price), 120, yPos);
        doc.text(formatCurrency(item.line_total), 165, yPos, { align: 'right' });
        yPos += 5;
      });

      yPos += 4;
    }

    // Resumen de pago (lado derecho)
    const summaryX = 120;
    doc.setFontSize(9);
    doc.setTextColor(43, 43, 40);
    const balance = Number(invoice.total) - Number(invoice.paid_amount);

    const summaryData = [
      ['Subtotal', formatCurrency(invoice.subtotal)],
      ['Descuento', formatCurrency(invoice.discount)],
      ['Total', formatCurrency(invoice.total)],
      ['Pagado', formatCurrency(invoice.paid_amount)],
      ['Saldo pendiente', formatCurrency(balance)],
    ];

    summaryData.forEach(([label, value], idx) => {
      doc.text(label, summaryX, yPos);
      if (idx === 2 || idx === 4) {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(31, 75, 67);
      }
      doc.text(value, pageWidth - margin, yPos, { align: 'right' });
      if (idx === 2) doc.setFont(undefined, 'normal');
      if (idx === 4) doc.setTextColor(76, 175, 80);
      yPos += 5;
    });

    yPos += 10;

    // Pagos registrados
    if (invoice.payments.length > 0) {
      doc.setFontSize(11);
      doc.setTextColor(31, 75, 67);
      doc.setFont(undefined, 'bold');
      doc.text('Pagos registrados', margin, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 6;

      // Header tabla
      doc.setFontSize(8);
      doc.setTextColor(114, 110, 101);
      doc.setFont(undefined, 'bold');
      doc.text('FECHA', margin, yPos);
      doc.text('MÉTODO', 60, yPos);
      doc.text('REFERENCIA', 100, yPos);
      doc.text('MONTO', 165, yPos, { align: 'right' });
      doc.setFont(undefined, 'normal');
      yPos += 1;

      // Línea
      doc.setDrawColor(228, 223, 211);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;

      // Pagos
      doc.setFontSize(9);
      doc.setTextColor(43, 43, 40);
      invoice.payments
        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
        .forEach((p) => {
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(formatDate(p.payment_date), margin, yPos);
          doc.text(p.method.charAt(0).toUpperCase() + p.method.slice(1), 60, yPos);
          doc.text(p.reference || '—', 100, yPos);
          doc.text(formatCurrency(p.amount), 165, yPos, { align: 'right' });
          yPos += 5;
        });
    }

    // Pie de página
    doc.setFontSize(7);
    doc.setTextColor(114, 110, 101);
    doc.text(`Generado el ${formatDate(new Date().toISOString())}`, margin, pageHeight - 10);
    doc.text('VetPanel · Sistema interno de administración', pageWidth - margin, pageHeight - 10, { align: 'right' });

    // Descargar
    doc.save(`orden_pago_${invoice.invoice_number}.pdf`);
  }

  return (
    <div>
      <Link className="back-link" to="/app/facturacion">← Facturación</Link>

      <div className="page-header">
        <div>
          <div className="eyebrow">Factura {invoice.invoice_number}</div>
          <h1>{invoice.owner?.full_name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={generatePDF}><Download size={15} /> Descargar PDF</button>
          <StatusBadge status={invoice.status} />
          <button className="btn btn-ghost btn-danger" onClick={() => setConfirmDelete(true)}><Trash2 size={15} /></button>
        </div>
      </div>

      <div className="field-row" style={{ marginBottom: 30, alignItems: 'stretch' }}>
        <div className="form-card">
          <h3 style={{ marginBottom: 14 }}>Detalles</h3>
          <DetailRow label="Paciente" value={invoice.patient?.name || 'General'} />
          <DetailRow label="Fecha de emisión" value={formatDate(invoice.issue_date)} />
          <DetailRow label="Vencimiento" value={invoice.due_date ? formatDate(invoice.due_date) : '—'} />
          <DetailRow label="Notas" value={invoice.notes || '—'} />
        </div>
        <div className="form-card">
          <h3 style={{ marginBottom: 14 }}>Resumen de pago</h3>
          <DetailRow label="Subtotal" value={formatCurrency(invoice.subtotal)} />
          <DetailRow label="Descuento" value={formatCurrency(invoice.discount)} />
          <DetailRow label="Total" value={formatCurrency(invoice.total)} />
          <DetailRow label="Pagado" value={formatCurrency(invoice.paid_amount)} />
          <DetailRow label="Saldo" value={<strong>{formatCurrency(balance)}</strong>} />
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Conceptos</h3>
      <table className="data-table" style={{ marginBottom: 34 }}>
        <thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio unitario</th><th>Importe</th></tr></thead>
        <tbody>
          {invoice.items.map((it) => (
            <tr key={it.id} style={{ cursor: 'default' }}>
              <td>{it.description}</td>
              <td>{it.quantity}</td>
              <td>{formatCurrency(it.unit_price)}</td>
              <td>{formatCurrency(it.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="section-title">
        <h3>Pagos recibidos</h3>
        {balance > 0 && invoice.status !== 'cancelada' && (
          <button className="btn btn-primary" onClick={() => setShowPayment(true)}><Plus size={15} /> Registrar pago</button>
        )}
      </div>

      {invoice.payments.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Aún no se han registrado pagos.</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>Fecha</th><th>Método</th><th>Referencia</th><th>Monto</th><th /></tr></thead>
          <tbody>
            {invoice.payments
              .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
              .map((p) => (
                <tr key={p.id} style={{ cursor: 'default' }}>
                  <td>{formatDate(p.payment_date)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.method}</td>
                  <td>{p.reference || '—'}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td>
                    <button className="btn-ghost btn-danger" onClick={() => setConfirmPaymentId(p.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {showPayment && (
        <PaymentFormModal
          invoiceId={id}
          balance={balance}
          onClose={() => setShowPayment(false)}
          onSaved={() => { setShowPayment(false); load(); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar factura"
          message="Esta acción eliminará la factura y sus pagos asociados de forma permanente."
          onConfirm={handleDeleteInvoice}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {confirmPaymentId && (
        <ConfirmDialog
          title="Eliminar pago"
          message="El saldo de la factura se recalculará automáticamente."
          onConfirm={handleDeletePayment}
          onCancel={() => setConfirmPaymentId(null)}
        />
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
