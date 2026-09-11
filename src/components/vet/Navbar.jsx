import React, { useState, useEffect } from "react";
import { Clock, Phone, Menu, X } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/user_6a70cee15114c4bd543bb971/b22ca7d99_a61ab3818_438822689_451567257406688_4185504863073451038_n.jpg";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[hsla(96,47%,97%,0.85)] backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(78,52,46,0.15)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3 group">
          <img
            src={LOGO_URL}
            alt="Clínica Veterinaria Animalandia"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[hsl(96_55%_42%)]/30 group-hover:ring-[hsl(96_55%_42%)] transition-all duration-300"
          />
          <div className="leading-tight">
            <p className="font-heading font-extrabold text-[hsl(20_32%_24%)] text-base tracking-tight">Animalandia</p>
            <p className="text-[11px] font-medium text-[hsl(96_55%_42%)] tracking-wide uppercase">Clínica Veterinaria</p>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-[hsl(20_32%_24%)]/70 hover:text-[hsl(96_55%_42%)] transition-colors rounded-full hover:bg-[hsla(96,55%,42%,0.1)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/528131099007"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-[hsl(16_100%_57%)] text-white font-semibold text-sm shadow-lg shadow-[hsl(16_100%_57%)]/30 hover:scale-[1.03] transition-transform"
          >
            <Phone className="w-4 h-4" /> Agenda tu cita
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-full text-[hsl(20_32%_24%)] hover:bg-[hsla(96,55%,42%,0.1)]"
          aria-label="Menú"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[hsla(96,47%,97%,0.95)] backdrop-blur-xl border-t border-[hsl(96_30%_88%)] px-5 py-4 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-2xl text-[hsl(20_32%_24%)] font-medium hover:bg-[hsla(96,55%,42%,0.1)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/528131099007"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[hsl(16_100%_57%)] text-white font-semibold"
          >
            <Phone className="w-4 h-4" /> Agenda tu cita
          </a>
        </div>
      )}
    </header>
  );
}