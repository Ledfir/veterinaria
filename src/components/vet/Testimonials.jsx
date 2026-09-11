import React from "react";
import { Star, Quote, Heart } from "lucide-react";
import { Image } from "@/components/ui/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "María González",
    pet: "Dueña de Max",
    quote: "Desde la primera visita supe que estaba en el lugar correcto. Atendieron a Max con muchísimo cariño y me explicaron todo con paciencia. ¡Totalmente recomendados!",
    stars: 5,
    img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/5ec69c703_generated_image.png",
    case: "Consulta y vacunación de Max",
  },
  {
    name: "Carlos Ramírez",
    pet: "Dueño de Luna",
    quote: "Luna tenía una infección y la atendieron un domingo por la noche. El compromiso del equipo con las urgencias 24/7 es real y le salvamos la vida a mi gata.",
    stars: 5,
    img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/3435ace61_generated_image.png",
    case: "Urgencia nocturna de Luna",
  },
  {
    name: "Ana Beltrán",
    pet: "Dueña de Coco",
    quote: "Coco es muy nervioso en los consultorios, pero aquí lo tratan con tanta calma que ni se asusta. El servicio a domicilio fue un plus increíble para nosotros.",
    stars: 5,
    img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/a4288c6ab_generated_image.png",
    case: "Visita a domicilio para Coco",
  },
  {
    name: "Jorge Salinas",
    pet: "Dueño de Thor",
    quote: "Llevamos a Thor desde cachorro. Siempre salimos con el diagnóstico claro y el trato más humano. No lo cambiaría por ningún otro veterinario.",
    stars: 5,
    img: "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/9bcf329c8_generated_image.png",
    case: "Cuidado de cachorro de Thor",
  },
];

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[hsl(96_55%_42%)] mb-3">
            <Heart className="w-4 h-4" /> Testimonios
          </p>
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[hsl(20_32%_24%)] tracking-tight leading-tight">
            Lo que dicen los dueños de nuestras mascotas
          </h2>
          <p className="mt-5 text-lg text-[hsla(20,32%,24%,0.65)] leading-relaxed">
            La confianza de las familias que atendemos es nuestro mejor logro.
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="pl-4 basis-full sm:basis-1/2">
                <article className="relative bg-white rounded-3xl border border-[hsl(96_30%_88%)] shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="relative h-52">
                    <Image src={t.img} alt={t.case} className="w-full h-full" fittingType="fill" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsla(20,32%,24%,0.55)] to-transparent" />
                    <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsla(96,47%,97%,0.9)] backdrop-blur text-xs font-semibold text-[hsl(96_55%_42%)]">
                      <Quote className="w-3.5 h-3.5" /> {t.case}
                    </span>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <p className="text-[15px] text-[hsla(20,32%,24%,0.75)] leading-relaxed flex-1">"{t.quote}"</p>
                    <div className="mt-6 pt-5 border-t border-[hsl(96_30%_88%)]">
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: t.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[hsl(48_100%_62%)] text-[hsl(48_100%_62%)]" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[hsl(96_55%_42%)] to-[hsl(16_100%_57%)] flex items-center justify-center shrink-0">
                          <span className="font-heading font-bold text-white text-sm">{initials(t.name)}</span>
                        </div>
                        <div className="leading-tight">
                          <p className="font-heading font-bold text-[hsl(20_32%_24%)] text-sm">{t.name}</p>
                          <p className="text-xs text-[hsla(20,32%,24%,0.55)]">{t.pet}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex -left-4 border-[hsl(96_30%_88%)]" />
          <CarouselNext className="hidden sm:inline-flex -right-4 border-[hsl(96_30%_88%)]" />
        </Carousel>
      </div>
    </section>
  );
}