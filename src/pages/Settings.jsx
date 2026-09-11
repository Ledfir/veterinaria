import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { listExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, getSiteConfig, updateSiteConfig, uploadSiteFavicon, uploadSiteLogo } from '../lib/api';
import { Loading } from '../components/ui';

export default function Settings() {
  // Estado para categorías
  const [categories, setCategories] = useState([]);
  const [siteConfig, setSiteConfig] = useState({ site_name: '', site_description: '', favicon_url: '', logo_url: '' });
  const [loading, setLoading] = useState(true);
  
  // Modal de categorías
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#6B7280' });
  
  // Modal de configuración del sitio
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [siteFormData, setSiteFormData] = useState({ site_name: '', site_description: '', favicon_url: '', logo_url: '' });
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [siteFormLoading, setSiteFormLoading] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categories, config] = await Promise.all([
        listExpenseCategories(),
        getSiteConfig(),
      ]);
      setCategories(categories);
      setSiteConfig(config);
      setSiteFormData(config);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    }
    setLoading(false);
  };

  // Funciones para categorías
  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, color: category.color });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ name: '', color: '#6B7280' });
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', color: '#6B7280' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    try {
      if (editingId) {
        await updateExpenseCategory(editingId, formData);
        setSuccess('Categoría actualizada correctamente');
      } else {
        await createExpenseCategory(formData);
        setSuccess('Categoría creada correctamente');
      }
      loadData();
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la categoría');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        setError('');
        await deleteExpenseCategory(id);
        setSuccess('Categoría eliminada correctamente');
        loadData();
      } catch (err) {
        setError(err.message || 'Error al eliminar la categoría');
      }
    }
  };

  // Funciones para configuración del sitio
  const handleSiteFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSiteFormLoading(true);

    if (!siteFormData.site_name.trim()) {
      setError('El nombre del sitio es requerido');
      setSiteFormLoading(false);
      return;
    }

    try {
      let faviconUrl = siteFormData.favicon_url;
      let logoUrl = siteFormData.logo_url;

      // Subir favicon si hay un nuevo archivo
      if (faviconFile) {
        faviconUrl = await uploadSiteFavicon(faviconFile);
      }

      // Subir logo si hay un nuevo archivo
      if (logoFile) {
        logoUrl = await uploadSiteLogo(logoFile);
      }

      await updateSiteConfig({
        site_name: siteFormData.site_name,
        site_description: siteFormData.site_description,
        favicon_url: faviconUrl || null,
        logo_url: logoUrl || null,
      });
      setSuccess('Configuración actualizada correctamente');
      loadData();
      handleCloseSiteForm();
    } catch (err) {
      setError(err.message || 'Error al guardar la configuración');
    }
    setSiteFormLoading(false);
  };

  const handleCloseSiteForm = () => {
    setShowSiteForm(false);
    setFaviconFile(null);
    setLogoFile(null);
    setFaviconPreview(null);
    setLogoPreview(null);
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setFaviconPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setLogoPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Sistema</div>
          <h1>Configuración</h1>
        </div>
      </div>

      {/* Sección de Configuración del Sitio */}
      <div className="form-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>Configuración del Sitio</h2>
          <button className="btn btn-primary" onClick={() => setShowSiteForm(true)}>
            Editar Configuración
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Nombre del Sitio</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{siteConfig.site_name}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>Descripción</div>
            <div style={{ fontSize: '0.9rem' }}>{siteConfig.site_description || 'Sin descripción'}</div>
          </div>
        </div>
      </div>

      {/* Sección de Categorías de Gastos */}
      <div className="form-card" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0 }}>Categorías de Gastos</h2>
          <button className="btn btn-primary" onClick={handleNew} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} />
            Nueva Categoría
          </button>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 4, marginBottom: 16, fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '12px 16px', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: 4, marginBottom: 16, fontSize: '0.9rem' }}>
            {success}
          </div>
        )}

        {/* Tabla de categorías */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Nombre</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Color</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No hay categorías. Crea una nueva.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text)' }}>{cat.name}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                          border: '1px solid var(--color-border)',
                        }}
                        title={cat.color}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        <button
                          className="btn btn-icon"
                          onClick={() => handleEdit(cat)}
                          style={{ color: 'var(--color-primary)' }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-icon"
                          onClick={() => handleDelete(cat.id)}
                          style={{ color: '#EF4444' }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Categorías */}
      {showForm && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar categoría' : 'Nueva categoría'}</h2>
              <button className="btn btn-icon" onClick={handleClose}>
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
                <label>Nombre de la categoría *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Suministros, Servicios..."
                  required
                />
              </div>

              <div className="field">
                <label>Color</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{ width: 60, height: 40, cursor: 'pointer', border: 'none', borderRadius: 4 }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{formData.color}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Crear'} categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configuración del Sitio */}
      {showSiteForm && (
        <div className="modal-overlay" onClick={() => handleCloseSiteForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Configuración del Sitio</h2>
              <button className="btn btn-icon" onClick={() => handleCloseSiteForm()}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSiteFormSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 4, fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <div className="field">
                <label>Nombre del Sitio *</label>
                <input
                  type="text"
                  value={siteFormData.site_name}
                  onChange={(e) => setSiteFormData({ ...siteFormData, site_name: e.target.value })}
                  placeholder="Ej: VetPanel"
                  required
                />
              </div>

              <div className="field">
                <label>Meta Descripción</label>
                <textarea
                  value={siteFormData.site_description}
                  onChange={(e) => setSiteFormData({ ...siteFormData, site_description: e.target.value })}
                  placeholder="Descripción corta que aparecerá en motores de búsqueda..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="field">
                <label>Favicon</label>
                <input
                  type="file"
                  accept="image/*,.ico"
                  onChange={handleFaviconChange}
                  style={{ display: 'block', marginBottom: 12 }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                  Formatos soportados: ICO, PNG, JPEG (32x32px recomendado)
                </div>
                {(faviconPreview || siteConfig.favicon_url) && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Vista previa:</div>
                    <img 
                      src={faviconPreview || siteConfig.favicon_url} 
                      alt="Favicon preview" 
                      style={{ width: 48, height: 48, border: '1px solid var(--color-border)', borderRadius: 4 }}
                    />
                  </div>
                )}
              </div>

              <div className="field">
                <label>Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: 'block', marginBottom: 12 }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                  Formatos soportados: PNG, JPEG, SVG, etc.
                </div>
                {(logoPreview || siteConfig.logo_url) && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Vista previa:</div>
                    <img 
                      src={logoPreview || siteConfig.logo_url} 
                      alt="Logo preview" 
                      style={{ maxWidth: 150, maxHeight: 80, border: '1px solid var(--color-border)', borderRadius: 4 }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => handleCloseSiteForm()}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={siteFormLoading}>
                  {siteFormLoading ? 'Guardando...' : 'Guardar Configuración'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
