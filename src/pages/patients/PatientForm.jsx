import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { listOwners, createOwner, createPatient, getPatient, updatePatient, uploadPatientPhoto, deletePatientPhoto } from '../../lib/api';

const emptyPatient = {
  name: '', species: 'Perro', breed: '', sex: 'Desconocido', birth_date: '', weight_kg: '', color: '', notes: '', photo_url: '',
};
const emptyOwner = { full_name: '', phone: '', email: '', address: '' };

export default function PatientForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [ownerMode, setOwnerMode] = useState('existing');
  const [ownerId, setOwnerId] = useState('');
  const [ownerForm, setOwnerForm] = useState(emptyOwner);
  const [patient, setPatient] = useState(emptyPatient);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!isEdit);

  useEffect(() => {
    listOwners().then(setOwners);
  }, []);

  useEffect(() => {
    if (isEdit) {
      getPatient(id).then((p) => {
        setPatient({
          name: p.name, species: p.species, breed: p.breed || '', sex: p.sex || 'Desconocido',
          birth_date: p.birth_date || '', weight_kg: p.weight_kg || '', color: p.color || '', notes: p.notes || '', photo_url: p.photo_url || '',
        });
        if (p.photo_url) setPhotoPreview(p.photo_url);
        setOwnerId(p.owner_id);
        setLoaded(true);
      });
    }
  }, [id, isEdit]);

  function updateField(setter) {
    return (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result || '');
      };
      reader.readAsDataURL(file);
    }
  }

  async function removePhoto() {
    if (patient.photo_url && isEdit) {
      try {
        await deletePatientPhoto(patient.photo_url);
      } catch (err) {
        console.error('Error al eliminar foto:', err);
      }
    }
    setPhotoFile(null);
    setPhotoPreview('');
    setPatient((prev) => ({ ...prev, photo_url: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let finalOwnerId = ownerId;
      if (ownerMode === 'new') {
        if (!ownerForm.full_name || !ownerForm.phone) {
          throw new Error('Indica al menos el nombre y teléfono del dueño.');
        }
        const created = await createOwner(ownerForm);
        finalOwnerId = created.id;
      } else if (!ownerId) {
        throw new Error('Selecciona un dueño existente.');
      }

      let photoUrl = patient.photo_url;
      if (photoFile) {
        const patientId = isEdit ? id : 'temp-' + Date.now();
        photoUrl = await uploadPatientPhoto(patientId, photoFile);
      }

      const payload = {
        ...patient,
        photo_url: photoUrl,
        owner_id: finalOwnerId,
        weight_kg: patient.weight_kg ? Number(patient.weight_kg) : null,
        birth_date: patient.birth_date || null,
      };

      if (isEdit) {
        await updatePatient(id, payload);
        navigate(`/pacientes/${id}`);
      } else {
        const created = await createPatient(payload);
        // Si se subió una foto con ID temporal, renombrarla
        if (photoFile) {
          try {
            const newPhotoUrl = await uploadPatientPhoto(created.id, photoFile);
            await updatePatient(created.id, { photo_url: newPhotoUrl });
          } catch (err) {
            console.error('Error al renombrar foto:', err);
          }
        }
        navigate(`/pacientes/${created.id}`);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return null;

  return (
    <div>
      <Link className="back-link" to={isEdit ? `/pacientes/${id}` : '/pacientes'}>← Volver</Link>
      <div className="page-header">
        <h1>{isEdit ? 'Editar paciente' : 'Nuevo paciente'}</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {!isEdit && (
          <>
            <h3 style={{ marginBottom: 14 }}>Dueño</h3>
            <div className="tag-row" style={{ marginBottom: 16 }}>
              <button type="button" className={`btn ${ownerMode === 'existing' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setOwnerMode('existing')}>
                Dueño existente
              </button>
              <button type="button" className={`btn ${ownerMode === 'new' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setOwnerMode('new')}>
                Nuevo dueño
              </button>
            </div>

            {ownerMode === 'existing' ? (
              <div className="field">
                <label>Selecciona un dueño</label>
                <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.full_name}{o.phone ? ` · ${o.phone}` : ''}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="field-row">
                  <div className="field">
                    <label>Nombre completo</label>
                    <input name="full_name" value={ownerForm.full_name} onChange={updateField(setOwnerForm)} required />
                  </div>
                  <div className="field">
                    <label>Teléfono</label>
                    <input name="phone" value={ownerForm.phone} onChange={updateField(setOwnerForm)} required />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Correo (opcional)</label>
                    <input name="email" type="email" value={ownerForm.email} onChange={updateField(setOwnerForm)} />
                  </div>
                  <div className="field">
                    <label>Dirección (opcional)</label>
                    <input name="address" value={ownerForm.address} onChange={updateField(setOwnerForm)} />
                  </div>
                </div>
              </>
            )}
            <div className="divider" />
          </>
        )}

        <h3 style={{ marginBottom: 14 }}>Paciente</h3>
        
        {/* Foto del paciente */}
        <div className="field" style={{ marginBottom: 16 }}>
          <label>Foto del paciente (opcional)</label>
          <div style={{
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: 'var(--color-bg)',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'rgba(31,75,67,0.05)';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg)';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'var(--color-bg)';
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
              setPhotoFile(file);
              const reader = new FileReader();
              reader.onload = (event) => {
                setPhotoPreview(event.target?.result || '');
              };
              reader.readAsDataURL(file);
            }
          }}
          >
            {photoPreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={photoPreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 'var(--radius-sm)' }} />
                <button
                  type="button"
                  onClick={removePhoto}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#A63B3B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Upload size={24} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Arrastra una imagen aquí o haz clic para seleccionar</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </div>

        <div className="field">
          <label>Nombre</label>
          <input name="name" value={patient.name} onChange={updateField(setPatient)} required />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Especie</label>
            <select name="species" value={patient.species} onChange={updateField(setPatient)}>
              <option>Perro</option>
              <option>Gato</option>
              <option>Ave</option>
              <option>Conejo</option>
              <option>Reptil</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="field">
            <label>Raza</label>
            <input name="breed" value={patient.breed} onChange={updateField(setPatient)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Sexo</label>
            <select name="sex" value={patient.sex} onChange={updateField(setPatient)}>
              <option>Desconocido</option>
              <option>Macho</option>
              <option>Hembra</option>
            </select>
          </div>
          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" name="birth_date" value={patient.birth_date} onChange={updateField(setPatient)} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Peso (kg)</label>
            <input type="number" step="0.1" name="weight_kg" value={patient.weight_kg} onChange={updateField(setPatient)} />
          </div>
          <div className="field">
            <label>Color</label>
            <input name="color" value={patient.color} onChange={updateField(setPatient)} />
          </div>
        </div>

        <div className="field">
          <label>Notas clínicas</label>
          <textarea name="notes" rows={3} value={patient.notes} onChange={updateField(setPatient)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}
