import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    navigate('/app');
  }

  if (loading) {
    return (
      <div className="login-shell">
        <div className="login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 30 }}>
          <PawPrint size={26} color="var(--color-primary)" />
          <h1 style={{ fontSize: '1.5rem' }}>VetPanel</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Correo</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tuveterinaria.com" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p style={{ marginTop: 22, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          El usuario administrador se crea desde el panel de Authentication en Supabase.
        </p>
      </div>
    </div>
  );
}
