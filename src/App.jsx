import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientsList from './pages/patients/PatientsList';
import PatientForm from './pages/patients/PatientForm';
import PatientDetail from './pages/patients/PatientDetail';
import AppointmentsCalendar from './pages/appointments/AppointmentsCalendar';
import InvoicesList from './pages/billing/InvoicesList';
import InvoiceForm from './pages/billing/InvoiceForm';
import InvoiceDetail from './pages/billing/InvoiceDetail';
import FinancialReport from './pages/billing/FinancialReport';
import ExpensesList from './pages/billing/ExpensesList';
import Settings from './pages/Settings';

export default function App() {
  return (
    <SiteConfigProvider>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />

            <Route path="pacientes" element={<PatientsList />} />
            <Route path="pacientes/nuevo" element={<PatientForm />} />
            <Route path="pacientes/:id" element={<PatientDetail />} />
            <Route path="pacientes/:id/editar" element={<PatientForm />} />

            <Route path="citas" element={<AppointmentsCalendar />} />

            <Route path="facturacion" element={<InvoicesList />} />
            <Route path="facturacion/nueva" element={<InvoiceForm />} />
            <Route path="facturacion/:id" element={<InvoiceDetail />} />
            <Route path="reportes/finanzas" element={<FinancialReport />} />
            <Route path="gastos" element={<ExpensesList />} />

            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </SiteConfigProvider>
  );
}