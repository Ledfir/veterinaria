import React from "react";
import { Image } from "@/components/ui/image";
import { Heart, Camera } from "lucide-react";

const patients = [
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/d89af79c4_generated_image.png", name: "Max", detail: "Golden Retriever · Consulta anual", aspect: "aspect-[4/5]" },
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/cf0b990f4_generated_image.png", name: "Luna", detail: "Gatita · Chequeo general", aspect: "aspect-square" },
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/6d3078f21_generated_image.png", name: "Coco", detail: "Chihuahua · Recuperación", aspect: "aspect-[3/4]" },
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/54bd961b4_generated_image.png", name: "Rocky", detail: "Bulldog Francés · Vacunación", aspect: "aspect-square" },
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/79ab6c2f4_generated_image.png", name: "Mía", detail: "Gatita · Primeras semanas", aspect: "aspect-[4/5]" },
  { photo: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/03c202b06_generated_image.png", name: "Thor", detail: "Pastor Alemán · Control mensual", aspect: "aspect-[3/4]" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-[hsl(96_47%_96%)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[hsl(16_100%_57%)] mb-3">
            <Camera className="w-4 h-4" /> Nuestros pacientes
          </p>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[hsl(20_32%_24%)] tracking-tight leading-tight">
            Historias felices que nos llenan de orgullo
          </h2>
          <p className="mt-5 text-lg text-[hsla(20,32%,24%,0.65)] leading-relaxed">
            Cada paciente que atendemos es parte de la familia Animalandia.
            Conoce algunas de sus sonrisas.
          </p>
        </div>

        <div className="columns-2 md:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
          {patients.map((p) => (
            <figure
              key={p.name}
              className="group relative mb-4 sm:mb-5 break-inside-avoid rounded-[1.75rem] overflow-hidden border border-[hsl(96_30%_88%)] shadow-sm hover:shadow-2xl hover:shadow-[hsla(96,55%,42%,0.15)] transition-all duration-300"
            >
              <div className={p.aspect}>
                <Image
                  src={p.photo}
                  alt={`${p.name}, paciente de Animalandia`}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-[hsla(20,32%,24%,0.75)] to-transparent">
                <p className="font-heading font-bold text-white text-base leading-tight">{p.name}</p>
                <p className="text-xs text-white/85 mt-0.5">{p.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[hsla(20,32%,24%,0.55)] inline-flex items-center gap-1.5 justify-center w-full">
          <Heart className="w-4 h-4 text-[hsl(16_100%_57%)]" />
          ¿Quieres que tu mascota aparezca aquí? Pregunta por su foto en tu próxima visita.
        </p>
      </div>
    </section>
  );
}