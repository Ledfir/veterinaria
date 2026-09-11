import React from "react";
import { Clock, Phone, AlertCircle, MapPin } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a70cee15114c4bd543bb971/b22ca7d99_a61ab3818_438822689_451567257406688_4185504863073451038_n.jpg";

export default function Hero({ heroImage }) {
  return (
    <section id="inicio" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* ambient blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[hsla(48,100%,62%,0.3)] blur-3xl" />
      <div className="absolute top-40 -left-24 w-80 h-80 rounded-full bg-[hsla(96,55%,42%,0.2)] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* left: copy */}
        <div className="lg:col-span-6 space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-[hsl(96_30%_88%)] text-sm font-medium text-[hsl(96_55%_42%)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(16_100%_57%)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(16_100%_57%)]" />
            </span>
            Urgencias 24/7 · Monterrey, N.L.
          </div>

          <h1 className="font-heading font-extrabold tracking-tight text-[hsl(20_32%_24%)] text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
            Cuidado, amor
            <br />
            y <span className="text-[hsl(96_55%_42%)]">bienestar</span>
            <br />
            <span className="text-[hsl(16_100%_57%)]">para quienes</span>
            <br />
            nos regalan su
            <br />
            compañía <span className="inline-block">♥</span>
          </h1>

          <p className="text-lg text-[hsla(20,32%,24%,0.7)] max-w-md leading-relaxed">
            En Clínica Veterinaria Animalandia combinamos medicina de precisión con
            calidez humana para cuidar a tu mascota en cada etapa de su vida.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/528131099007"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-full bg-[hsl(16_100%_57%)] text-white font-semibold shadow-xl shadow-[hsla(16,100%,57%,0.3)] hover:scale-[1.03] transition-transform min-h-[48px]"
            >
              <Phone className="w-5 h-5" /> Agenda tu cita
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 h-13 px-7 py-3.5 rounded-full bg-white text-[hsl(20_32%_24%)] font-semibold border border-[hsl(96_30%_88%)] hover:border-[hsl(96_55%_42%)] hover:text-[hsl(96_55%_42%)] transition-colors min-h-[48px]"
            >
              Ver servicios
            </a>
          </div>

          {/* quick info chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/70 backdrop-blur border border-[hsl(96_30%_88%)] text-sm">
              <Clock className="w-4 h-4 text-[hsl(96_55%_42%)]" />
              <span className="font-medium text-[hsl(20_32%_24%)]">L–V 9am–8pm</span>
              <span className="text-[hsla(20,32%,24%,0.5)]">·</span>
              <span className="font-medium text-[hsl(20_32%_24%)]">S 9am–1:30pm</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[hsla(0,84%,54%,0.1)] border border-[hsla(0,84%,54%,0.2)] text-sm">
              <AlertCircle className="w-4 h-4 text-[hsl(0_84%_54%)]" />
              <span className="font-semibold text-[hsl(0_84%_54%)]">Urgencias 24/7</span>
            </div>
          </div>
        </div>

        {/* right: image */}
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/5] max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[hsl(48_100%_62%)] to-[hsl(96_55%_42%)] rotate-3" />
            <img
              src={heroImage}
              alt="Cuidado veterinario con amor"
              className="relative w-full h-full object-cover rounded-[2.5rem] shadow-2xl"
            />
            {/* floating logo card */}
            <div className="absolute -bottom-6 -left-6 sm:-left-10 bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white flex items-center gap-3 max-w-[15rem]">
              <img src={LOGO_URL} alt="Animalandia" className="w-14 h-14 rounded-full object-cover" />
              <div className="leading-tight">
                <p className="font-heading font-bold text-[hsl(20_32%_24%)] text-sm">Animalandia</p>
                <p className="text-[11px] text-[hsla(20,32%,24%,0.6)]">Servicio a domicilio disponible</p>
              </div>
            </div>
            {/* floating badge */}
            <div className="absolute -top-4 -right-2 sm:-right-6 bg-[hsl(96_55%_42%)] text-white rounded-2xl px-4 py-3 shadow-xl rotate-6">
              <p className="text-2xl font-heading font-extrabold leading-none">+10</p>
              <p className="text-[10px] font-medium tracking-wide uppercase">años cuidando</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}