import React from "react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/528131099007"
      target="_blank"
      rel="noreferrer"
      aria-label="Agenda tu cita por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <span className="pointer-events-none translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full shadow-xl border border-[hsl(96_30%_88%)] px-5 py-2.5 font-heading font-bold text-[hsl(20_32%_24%)] whitespace-nowrap">
        Agenda tu cita 🐶
      </span>
      <span className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white" aria-hidden="true">
          <path d="M16 2.7C8.7 2.7 2.8 8.6 2.8 15.9c0 2.3.6 4.6 1.8 6.6L2.7 29.3l7-1.8c1.9 1 4.1 1.6 6.3 1.6 7.3 0 13.2-5.9 13.2-13.2S23.3 2.7 16 2.7zm0 24.1c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.2 1.1 1.1-4.1-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.7C4.9 9.5 9.9 4.5 16 4.5s11.1 5 11.1 11.1-5 11.2-11.1 11.2zm6.1-8.3c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2.1-1.9-2.4-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.8-1.9-1-2.6-.3-.6-.6-.6-.8-.6h-.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z" />
        </svg>
      </span>
    </a>
  );
}