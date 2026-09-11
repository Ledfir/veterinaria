import React from "react";
import { Phone, Clock, MapPin, AlertCircle, Calendar, MessageCircle } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a70cee15114c4bd543bb971/b22ca7d99_a61ab3818_438822689_451567257406688_4185504863073451038_n.jpg";

export default function Contact() {
  return (
    <section id="contacto" className="relative bg-[hsl(20_32%_24%)] text-white overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsla(96,55%,42%,0.2)] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[hsla(16,100%,57%,0.2)] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase text-[hsl(48_100%_62%)] mb-3">Estamos para ti</p>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight leading-tight">
            Agenda tu cita o contáctanos para una urgencia
          </h2>
          <p className="mt-5 text-lg text-white/65 leading-relaxed">
            Tu mascota merece atención oportuna. Escríbenos por WhatsApp y te responderemos al instante.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {/* Emergency card */}
          <div className="md:col-span-1 bg-[hsl(0_84%_54%)] rounded-3xl p-8 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-heading font-extrabold text-xl">Urgencias 24/7</p>
                <p className="text-sm text-white/80">Atención inmediata siempre</p>
              </div>
            </div>
            <a href="tel:8131099007" className="mt-6 inline-flex items-center gap-2 text-2xl font-heading font-extrabold hover:underline">
              <Phone className="w-6 h-6" /> 81-31-09-90-07
            </a>
          </div>

          {/* Hours card */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 min-h-[220px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[hsla(48,100%,62%,0.2)] flex items-center justify-center">
                <Clock className="w-6 h-6 text-[hsl(48_100%_62%)]" />
              </div>
              <p className="font-heading font-extrabold text-xl">Horarios</p>
            </div>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center justify-between">
                <span>Lunes a Viernes</span>
                <span className="font-semibold text-white">9:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Sábado</span>
                <span className="font-semibold text-white">9:00 AM – 1:30 PM</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Urgencias</span>
                <span className="font-semibold text-[hsl(16_100%_57%)]">24 horas</span>
              </li>
            </ul>
          </div>

          {/* Location card */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 min-h-[220px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[hsla(96,55%,42%,0.3)] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[hsl(96_55%_42%)]" />
              </div>
              <p className="font-heading font-extrabold text-xl">Ubicación</p>
            </div>
            <p className="text-white/80 leading-relaxed">
              Calle Limón #230
              <br />
              Jardines de la Silla
              <br />
              Juárez, Nuevo León ♥
            </p>
            <a
              href="https://maps.google.com/?q=Calle+Limón+230+Jardines+de+la+Silla+Juárez+Nuevo+León"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(48_100%_62%)] hover:underline"
            >
              Cómo llegar →
            </a>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/528131099007"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-full bg-[hsl(16_100%_57%)] text-white font-semibold shadow-xl hover:scale-[1.03] transition-transform min-h-[48px]"
          >
            <Calendar className="w-5 h-5" /> Agenda tu cita
          </a>
          <a
            href="https://wa.me/528131099007"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-13 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors min-h-[48px]"
          >
            <MessageCircle className="w-5 h-5" /> Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      {/* footer bar */}
      <footer className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Animalandia" className="w-10 h-10 rounded-full object-cover" />
            <div className="leading-tight">
              <p className="font-heading font-bold text-sm">Clínica Veterinaria Animalandia</p>
              <p className="text-xs text-white/50">Cuidado, amor y bienestar ♥</p>
            </div>
          </div>
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Animalandia · Todos los derechos reservados</p>
        </div>
      </footer>
    </section>
  );
}