import React from "react";
import ChihuahuaMascot from "@/components/vet/ChihuahuaMascot";
import { Image } from "@/components/ui/image";
import {
  Stethoscope, Syringe, Microscope, Scissors, Bath, Building2, ScanLine, MonitorDot, FlaskConical, Bone as Tooth, Flame, ShoppingBag, Home
} from "lucide-react";

const services = [
  { icon: Stethoscope, anim: "svc-anim-swing", delay: "0s", name: "Consultas", desc: "Evaluación clínica completa y diagnóstico profesional.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/51b8cbce3_generated_image.png" },
  { icon: Syringe, anim: "svc-anim-tilt", delay: "0.3s", name: "Vacunas", desc: "Esquemas de vacunación para cada etapa de vida.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/4b6338f97_generated_image.png" },
  { icon: Microscope, anim: "svc-anim-float", delay: "0.6s", name: "Desparasitación", desc: "Tratamientos preventivos y curativos internos/externos.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/25a7fde6e_generated_image.png" },
  { icon: Scissors, anim: "svc-anim-wiggle", delay: "0.9s", name: "Cirugías", desc: "Procedimientos quirúrgicos con monitoreo avanzado.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/f2a892633_generated_image.png" },
  { icon: Bath, anim: "svc-anim-bob", delay: "0.2s", name: "Baños y Estéticas", desc: "Estética y aseo profesional con productos de calidad.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/9938ede2e_generated_image.png" },
  { icon: Building2, anim: "svc-anim-pulse", delay: "0.5s", name: "Hospital", desc: "Hospitalización y monitoreo continuo de pacientes.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/3029775cc_generated_image.png" },
  { icon: ScanLine, anim: "svc-anim-hop", delay: "0.8s", name: "Rayos X", desc: "Estudios radiográficos digitales para diagnóstico preciso.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/183ee6bff_generated_image.png" },
  { icon: MonitorDot, anim: "svc-anim-pulse", delay: "1.1s", name: "Ecografía", desc: "Ultrasonido diagnóstico no invasivo en tiempo real.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/817956bcd_generated_image.png" },
  { icon: FlaskConical, anim: "svc-anim-bob", delay: "0.4s", name: "Laboratorio Clínico", desc: "Análisis de sangre, heces y orina con resultados rápidos.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/f22c5c066_generated_image.png" },
  { icon: Tooth, anim: "svc-anim-wiggle", delay: "0.7s", name: "Limpieza Dental", desc: "Higiene bucal y profilaxis para una salud integral.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/a4b1ae935_generated_image.png" },
  { icon: Flame, anim: "svc-anim-flicker", delay: "0.1s", name: "Servicio de Cremación", desc: "Despedida digna y respetuosa para tu compañero.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/cae5f8efc_generated_image.png" },
  { icon: ShoppingBag, anim: "svc-anim-hop", delay: "0.6s", name: "Alimentos y Accesorios", desc: "Nutrición especializada y todo para tu mascota.", img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/f9026de08_generated_image.png" },
];

export default function Services() {
  return (
    <section id="servicios" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="relative max-w-2xl mb-16">
          <div className="absolute -top-2 right-0 hidden sm:block">
            <ChihuahuaMascot />
          </div>
          <p className="text-sm font-semibold tracking-widest uppercase text-[hsl(96_55%_42%)] mb-3">Nuestros servicios</p>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[hsl(20_32%_24%)] tracking-tight leading-tight">
            Todo el cuidado que tu mascota merece, en un solo lugar
          </h2>
          <p className="mt-5 text-lg text-[hsl(20_32%_24%)]/65 leading-relaxed">
            Atención integral con tecnología de punta y un equipo que ama a los animales
            tanto como tú.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.name}
                className="group relative bg-white rounded-3xl p-6 border border-[hsl(96_30%_88%)] hover:border-transparent group-hover:bg-transparent hover:shadow-2xl hover:shadow-[hsla(20,32%,24%,0.3)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Image src={s.img} alt={s.name} className="w-full h-full" fittingType="fill" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsla(20,32%,24%,0.92)] via-[hsla(20,32%,24%,0.55)] to-[hsla(20,32%,24%,0.2)]" />
                </div>
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[hsl(96_55%_42%)] via-[hsl(48_100%_62%)] to-[hsl(16_100%_57%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[hsla(96,55%,42%,0.12)] flex items-center justify-center mb-4 group-hover:bg-[hsla(255,255%,255%,0.18)] transition-colors duration-300">
                    <Icon
                      className={`w-7 h-7 text-[hsl(96_55%_42%)] group-hover:text-white group-hover:[animation-play-state:paused] transition-colors duration-300 ${s.anim}`}
                      style={{ animationDelay: s.delay }}
                    />
                  </div>
                  <h3 className="font-heading font-bold text-[hsl(20_32%_24%)] group-hover:text-white text-lg mb-1.5 transition-colors duration-300">{s.name}</h3>
                  <p className="text-sm text-[hsla(20,32%,24%,0.6)] group-hover:text-white/85 leading-relaxed transition-colors duration-300">{s.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* home service banner */}
        <div className="mt-12 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[hsl(96_55%_42%)] to-[hsl(96_55%_32%)] p-8 sm:p-12">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-2xl">Servicio a domicilio</h3>
                <p className="text-white/85 mt-1 max-w-md">
                  Contamos con atención veterinaria en la comodidad de tu hogar para reducir el estrés de tu mascota.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/528131099007"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-[hsl(96_55%_42%)] font-semibold whitespace-nowrap hover:scale-[1.03] transition-transform"
            >
              Solicitar visita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}