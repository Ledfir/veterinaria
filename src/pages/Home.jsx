import React from "react";
import Navbar from "@/components/vet/Navbar";
import Hero from "@/components/vet/Hero";
import Services from "@/components/vet/Services";
import About from "@/components/vet/About";
import Gallery from "@/components/vet/Gallery";
import Testimonials from "@/components/vet/Testimonials";
import WhatsAppFloat from "@/components/vet/WhatsAppFloat";
import Contact from "@/components/vet/Contact";
import Preloader from "@/components/vet/Preloader";
import { Scripts } from "react-router-dom";

const HERO_IMAGE = "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/7c8120ab4_generated_e1a43911.jpg";
const INTERIOR_IMAGE = "https://media.base44.com/images/public/6aa0761c03de0b757ada0933/5bd31929f_generated_2af5f15d.jpg";

export default function Home() {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" />
      <div className="min-h-screen bg-[hsl(96_47%_96%)]">
      <Preloader />
      <Navbar />
      <main>
        <Hero heroImage={HERO_IMAGE} />
        <Services />
        <About interiorImage={INTERIOR_IMAGE} />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <WhatsAppFloat />
      </div>
      <scripts src="/scripts.js"></scripts>
    </>
  );
}