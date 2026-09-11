import React from "react";
import { Heart, ShieldCheck, Sparkles, Clock4 } from "lucide-react";

const values = [
  { icon: Heart, title: "Amor por cada paciente", desc: "Tratamos a cada mascota como si fuera nuestra, con paciencia y cariño genuino." },
  { icon: ShieldCheck, title: "Medicina confiable", desc: "Protocolos clínicos rigurosos y equipo profesional con experiencia comprobada." },
  { icon: Sparkles, title: "Tecnología de punta", desc: "Rayos X, ecografía y laboratorio para diagnósticos precisos y oportunos." },
  { icon: Clock4, title: "Disponibles 24/7", desc: "Sabemos que las urgencias no esperan, por eso estamos siempre listos." },
];

export default function About({ interiorImage }) {
  return (
    <section id="nosotros" className="relative py-24 sm:py-32 bg-gradient-to-b from-[hsl(96_47%_96%)] to-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img src={interiorImage} alt="Instalaciones de Animalandia" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-3xl p-5 shadow-xl border border-[hsl(96_30%_88%)] max-w-[14rem]">
            <p className="font-heading font-extrabold text-3xl text-[hsl(96_55%_42%)]">100%</p>
            <p className="text-sm text-[hsla(20,32%,24%,0.65)] mt-1">Compromiso con el bienestar animal en cada visita.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[hsl(16_100%_57%)] mb-3">¿Por qué Animalandia?</p>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[hsl(20_32%_24%)] tracking-tight leading-tight">
              Donde la ciencia veterinaria se encuentra con el amor
            </h2>
            <p className="mt-5 text-lg text-[hsla(20,32%,24%,0.65)] leading-relaxed">
              Somos un equipo apasionado por el bienestar animal. En Animalandia unimos
              experiencia médica, tecnología y calidez para ofrecer a tu mascota el mejor
              cuidado posible, y a ti la tranquilidad de saber que está en buenas manos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="flex gap-4 p-5 rounded-2xl bg-white/70 backdrop-blur border border-[hsl(96_30%_88%)]">
                  <div className="w-11 h-11 rounded-xl bg-[hsla(48,100%,62%,0.2)] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[hsl(96_55%_42%)]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[hsl(20_32%_24%)] text-base mb-1">{v.title}</h3>
                    <p className="text-sm text-[hsla(20,32%,24%,0.6)] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}