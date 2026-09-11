import { useEffect, useMemo, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import { listAppointments } from '../../lib/api';
import AppointmentFormModal from './AppointmentFormModal';

const locales = { es };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek: () => startOfWeek(new Date(), { locale: es }), getDay, locales,
});

const messages = {
  next: 'Sig.', previous: 'Ant.', today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día',
  agenda: 'Agenda', date: 'Fecha', time: 'Hora', event: 'Cita', noEventsInRange: 'No hay citas en este rango.',
};

const statusColor = {
  pendiente: '#726E65',
  confirmada: '#1F4B43',
  completada: '#4F7A5D',
  cancelada: '#A63B3B',
};

export default function AppointmentsCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  async function load() {
    const data = await listAppointments();
    setAppointments(data);
  }
  useEffect(() => { load(); }, []);

  const events = useMemo(
    () =>
      appointments.map((a) => ({
        id: a.id,
        title: `${a.patient?.name || 'Paciente'} · ${a.reason}`,
        start: new Date(a.start_time),
        end: new Date(a.end_time),
        resource: a,
      })),
    [appointments]
  );

  const eventStyleGetter = useCallback((event) => ({
    style: {
      backgroundColor: statusColor[event.resource.status] || '#1F4B43',
      borderRadius: 4, border: 'none', color: '#fff', fontSize: '0.8rem', padding: '2px 6px',
    },
  }), []);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="eyebrow">Agenda</div>
          <h1>Citas</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating({ start: new Date(), end: new Date(Date.now() + 30 * 60000) })}>
          <Plus size={16} /> Nueva cita
        </button>
      </div>

      <div className="form-card" style={{ maxWidth: 'none', height: 640 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          culture="es"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelected(event.resource)}
          onSelectSlot={(slot) => setCreating({ start: slot.start, end: slot.end })}
          selectable
          popup
        />
      </div>

      {selected && (
        <AppointmentFormModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onSaved={() => { setSelected(null); load(); }}
          onDeleted={() => { setSelected(null); load(); }}
        />
      )}

      {creating && (
        <AppointmentFormModal
          defaultStart={creating.start}
          defaultEnd={creating.end}
          onClose={() => setCreating(null)}
          onSaved={() => { setCreating(null); load(); }}
        />
      )}
    </div>
  );
}
