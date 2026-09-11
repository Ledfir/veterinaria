import { supabase } from './supabaseClient';

/* ---------------- Owners ---------------- */
export async function listOwners() {
  const { data, error } = await supabase.from('owners').select('*').order('full_name');
  if (error) throw error;
  return data;
}

export async function createOwner(payload) {
  const { data, error } = await supabase.from('owners').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateOwner(id, payload) {
  const { data, error } = await supabase.from('owners').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

/* ---------------- Patients ---------------- */
export async function listPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*, owner:owners(id, full_name, phone)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPatient(id) {
  const { data, error } = await supabase
    .from('patients')
    .select('*, owner:owners(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createPatient(payload) {
  const { data, error } = await supabase.from('patients').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updatePatient(id, payload) {
  const { data, error } = await supabase.from('patients').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePatient(id) {
  const { error } = await supabase.from('patients').delete().eq('id', id);
  if (error) throw error;
}

/* ---------------- Appointments ---------------- */
export async function listAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patient:patients(id, name, owner:owners(full_name))')
    .order('start_time');
  if (error) throw error;
  return data;
}

export async function createAppointment(payload) {
  const { data, error } = await supabase.from('appointments').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateAppointment(id, payload) {
  const { data, error } = await supabase.from('appointments').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAppointment(id) {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
}

export async function listAppointmentsForPatient(patientId) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_time', { ascending: false });
  if (error) throw error;
  return data;
}

/* ---------------- Services catalog ---------------- */
export async function listServices() {
  const { data, error } = await supabase.from('services').select('*').eq('active', true).order('name');
  if (error) throw error;
  return data;
}

/* ---------------- Invoices ---------------- */
export async function listInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, owner:owners(full_name), patient:patients(name)')
    .order('issue_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getInvoice(id) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, owner:owners(*), patient:patients(id, name), items:invoice_items(*), payments(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function listInvoicesForPatient(patientId) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('patient_id', patientId)
    .order('issue_date', { ascending: false });
  if (error) throw error;
  return data;
}

async function nextInvoiceNumber() {
  const { count, error } = await supabase.from('invoices').select('*', { count: 'exact', head: true });
  if (error) throw error;
  const n = (count || 0) + 1;
  return `F-${String(n).padStart(5, '0')}`;
}

export async function createInvoiceWithItems({ header, items }) {
  const invoice_number = await nextInvoiceNumber();
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({ ...header, invoice_number })
    .select()
    .single();
  if (error) throw error;

  if (items.length) {
    const rows = items.map((it) => ({ ...it, invoice_id: invoice.id }));
    const { error: itemsError } = await supabase.from('invoice_items').insert(rows);
    if (itemsError) throw itemsError;
  }
  return invoice;
}

export async function updateInvoiceHeader(id, payload) {
  const { data, error } = await supabase.from('invoices').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function replaceInvoiceItems(invoiceId, items) {
  const { error: delError } = await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);
  if (delError) throw delError;
  if (items.length) {
    const rows = items.map((it) => ({ ...it, invoice_id: invoiceId }));
    const { error } = await supabase.from('invoice_items').insert(rows);
    if (error) throw error;
  }
}

export async function deleteInvoice(id) {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) throw error;
}

/* ---------------- Payments ---------------- */
export async function addPayment(payload) {
  const { data, error } = await supabase.from('payments').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deletePayment(id) {
  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) throw error;
}

/* ---------------- Patient Photos ---------------- */
export async function uploadPatientPhoto(patientId, file) {
  if (!file) return null;

  // Generar nombre único para la foto
  const timestamp = new Date().getTime();
  const ext = file.name.split('.').pop();
  const filename = `patient-${patientId}-${timestamp}.${ext}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('patient-photos')
    .upload(filename, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Obtener URL pública
  const { data } = supabase.storage.from('patient-photos').getPublicUrl(filename);
  return data.publicUrl;
}

export async function deletePatientPhoto(photoUrl) {
  if (!photoUrl) return;

  // Extraer el nombre del archivo de la URL pública
  const filename = photoUrl.split('/').pop();

  const { error } = await supabase.storage.from('patient-photos').remove([filename]);
  if (error) throw error;
}

/* ---------------- Dashboard ---------------- */
export async function dashboardStats() {
  const [{ count: patientsCount }, { data: todayAppts }, { data: pendingInvoices }, { data: monthPayments }] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase
      .from('appointments')
      .select('*, patient:patients(name)')
      .gte('start_time', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      .lt('start_time', new Date(new Date().setHours(24, 0, 0, 0)).toISOString())
      .order('start_time'),
    supabase.from('invoices').select('total, paid_amount').in('status', ['pendiente', 'parcial', 'vencida']),
    supabase
      .from('payments')
      .select('amount')
      .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)),
  ]);

  const outstanding = (pendingInvoices || []).reduce((sum, inv) => sum + Number(inv.total) - Number(inv.paid_amount), 0);
  const monthTotal = (monthPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    patientsCount: patientsCount || 0,
    todayAppointments: todayAppts || [],
    outstanding,
    monthTotal,
  };
}

/* ---------------- Expenses (Gastos) ---------------- */
export async function listExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getExpense(id) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createExpense(payload) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpense(id, payload) {
  const { data, error } = await supabase
    .from('expenses')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

export async function listExpenseCategories() {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function createExpenseCategory(payload) {
  const { data, error } = await supabase.from('expense_categories').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateExpenseCategory(id, payload) {
  const { data, error } = await supabase.from('expense_categories').update(payload).eq('id', id).select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function deleteExpenseCategory(id) {
  const { error } = await supabase.from('expense_categories').delete().eq('id', id);
  if (error) throw error;
}

/* ---------------- Site Configuration ---------------- */
export async function getSiteConfig() {
  const { data, error } = await supabase.from('site_config').select('*').limit(1).single();
  if (error) throw error;
  return data;
}

export async function updateSiteConfig(payload) {
  const config = await getSiteConfig();
  const { data, error } = await supabase.from('site_config').update(payload).eq('id', config.id).select();
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

export async function uploadSiteFavicon(file) {
  if (!file) return null;

  const timestamp = new Date().getTime();
  const ext = file.name.split('.').pop();
  const filename = `favicon-${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('site-assets')
    .upload(filename, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('site-assets').getPublicUrl(filename);
  return data.publicUrl;
}

export async function uploadSiteLogo(file) {
  if (!file) return null;

  const timestamp = new Date().getTime();
  const ext = file.name.split('.').pop();
  const filename = `logo-${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('site-assets')
    .upload(filename, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('site-assets').getPublicUrl(filename);
  return data.publicUrl;
}

export async function getExpensesByMonth(month, year) {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)
    .order('expense_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getExpensesByCategory() {
  const { data, error } = await supabase
    .from('expenses')
    .select('category, amount')
    .order('category');
  if (error) throw error;
  
  const grouped = {};
  (data || []).forEach((exp) => {
    if (!grouped[exp.category]) grouped[exp.category] = 0;
    grouped[exp.category] += Number(exp.amount);
  });
  
  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total
  }));
}
