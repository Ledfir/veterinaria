import React, { useEffect, useRef } from "react";
import anime from "animejs";

const CHIHUAHUA_URL = "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/b54919d92_generated_image.png";

export default function ChihuahuaMascot() {
  const pupRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const hop = anime({
      targets: pupRef.current,
      translateY: [
        { value: 0, duration: 0 },
        { value: -22, duration: 320, easing: "easeOutQuad" },
        { value: 0, duration: 340, easing: "easeInQuad" },
      ],
      rotate: [
        { value: -6, duration: 300, easing: "easeOutQuad" },
        { value: 6, duration: 300, easing: "easeInOutQuad" },
        { value: 0, duration: 200, easing: "easeOutQuad" },
      ],
      loop: true,
      endDelay: 900,
    });

    const shadow = anime({
      targets: shadowRef.current,
      scaleX: [
        { value: 1, duration: 0 },
        { value: 0.7, duration: 320, easing: "easeOutQuad" },
        { value: 1, duration: 340, easing: "easeInQuad" },
      ],
      opacity: [
        { value: 0.35, duration: 0 },
        { value: 0.15, duration: 320 },
        { value: 0.35, duration: 340 },
      ],
      loop: true,
      endDelay: 900,
    });

    return () => {
      hop.pause();
      shadow.pause();
    };
  }, []);

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 select-none" aria-hidden="true">
      <div ref={shadowRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full bg-[hsla(20,32%,24%,0.35)]" />
      <div ref={pupRef} className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-[hsl(48_100%_62%)] shadow-lg shadow-[hsla(96,55%,42%,0.15)]">
        <img src={CHIHUAHUA_URL} alt="Chihuahua de Animalandia" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}