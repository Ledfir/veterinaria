import React, { useEffect, useState } from "react";
import { Dog, Cat } from "lucide-react";

export default function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => {
      setLeaving(true);
      document.body.style.overflow = "";
    }, 1800);
    const t2 = setTimeout(() => setGone(true), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* left panel */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[hsl(96_55%_38%)] to-[hsl(96_55%_48%)] transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          leaving ? "-translate-x-full" : "translate-x-0"
        }`}
      />
      {/* right panel */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[hsl(16_100%_50%)] to-[hsl(16_100%_60%)] transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          leaving ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* center content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-end gap-8">
          <Dog className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg animate-pet-jump" />
          <Cat className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg animate-pet-jump [animation-delay:0.45s]" />
        </div>
        <div className="text-center">
          <p className="font-heading font-extrabold text-white text-3xl md:text-4xl tracking-tight drop-shadow-md">
            Animalandia
          </p>
          <p className="text-white/85 text-xs font-semibold tracking-[0.3em] uppercase mt-2">
            Clínica Veterinaria
          </p>
        </div>
      </div>
    </div>
  );
}