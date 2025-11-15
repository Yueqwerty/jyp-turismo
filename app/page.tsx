'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

const TourCard = ({
  title,
  description,
  tags,
  image,
  gradient,
  className = "",
  featured = false
}: {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  gradient: string;
  className?: string;
  featured?: boolean;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer ${className}`}
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {image && !imgError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className={`relative z-10 p-8 ${featured ? 'md:p-12' : 'md:p-8'} h-full flex flex-col justify-between`}>
        <div>
          {featured && (
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-white text-xs font-semibold uppercase tracking-wider mb-6 border border-white/30">
              Destacado
            </span>
          )}
          <h3 className={`font-black text-white mb-4 leading-tight tracking-tight ${featured ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>
            {title}
          </h3>
          <p className={`text-white/90 font-light leading-relaxed ${featured ? 'text-xl mb-8 max-w-lg' : 'text-sm mb-6'}`}>
            {description}
          </p>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-white/15 backdrop-blur-xl rounded-full text-white text-sm font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-colors duration-500"></div>

      {/* Glow effect */}
      {featured && (
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/30 rounded-full blur-[100px] group-hover:blur-[120px] transition-all duration-500"></div>
      )}
    </motion.div>
  );
};

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="mb-8 inline-block"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <span className="text-5xl font-black bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">
                  JYP
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight"
          >
            <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              La Patagonia
            </span>
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Te Espera
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="text-xl md:text-2xl text-blue-200/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Descubre glaciares milenarios, lagos turquesa y montañas imponentes en la región más prístina de Chile
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#tours"
              className="group relative overflow-hidden bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Explorar Destinos
              </span>
            </a>
            <a
              href="#contacto"
              className="relative group bg-white/5 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <span className="relative z-10">Contáctanos</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-blue-300/60 text-xs font-medium uppercase tracking-widest">Descubre más</span>
            <div className="w-6 h-10 border-2 border-blue-400/30 rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-32 px-4 md:px-8 bg-[#0A0A0A] relative overflow-hidden" id="tours">
        {/* Background effects */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]"></div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-4 block">
              Experiencias Únicas
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Nuestros Tours
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Aventuras diseñadas para conectarte con la naturaleza más salvaje de Aysén
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {/* Laguna San Rafael - Hero card */}
            <TourCard
              title="Laguna San Rafael"
              description="Navegación hasta el imponente Glaciar San Rafael, parte del Campo de Hielo Norte. Observa témpanos de hielo azul flotando en aguas cristalinas y escucha el estruendo de los desprendimientos."
              tags={["Navegación", "Día Completo", "Glaciar"]}
              image="/images/tours/laguna-san-rafael.jpg"
              gradient="from-blue-600 via-cyan-600 to-blue-700"
              className="md:col-span-7 md:row-span-2 min-h-[500px]"
              featured
            />

            {/* Capillas del Mármol */}
            <TourCard
              title="Capillas del Mármol"
              description="Explora las formaciones de mármol más espectaculares del mundo. Colores turquesa y azul cambian con las estaciones."
              tags={["Navegación", "Fotografía"]}
              image="/images/tours/capillas-marmol.jpg"
              gradient="from-cyan-500 via-blue-600 to-indigo-600"
              className="md:col-span-5 min-h-[280px]"
            />

            {/* Parque Nacional Queulat */}
            <TourCard
              title="Parque Nacional Queulat"
              description="Ventisquero Colgante y bosques milenarios. Una de las postales más icónicas de Aysén con su glaciar suspendido entre montañas."
              tags={["Trekking", "Naturaleza"]}
              image="/images/tours/queulat.jpg"
              gradient="from-emerald-600 to-green-700"
              className="md:col-span-5 min-h-[280px]"
            />

            {/* Full Mármol Puerto Sánchez */}
            <TourCard
              title="Full Mármol desde Puerto Sánchez"
              description="Navegación completa por las Cuevas y Capillas de Mármol. Incluye recorrido por Catedral de Mármol y zonas exclusivas."
              tags={["Navegación", "Día Completo"}}
              image="/images/tours/puerto-sanchez.jpg"
              gradient="from-blue-500 via-violet-600 to-purple-600"
              className="md:col-span-5 min-h-[320px]"
            />

            {/* Ensenada Pérez */}
            <TourCard
              title="Ensenada Pérez"
              description="Fiordos prístinos y aguas glaciares. Conecta con la naturaleza más remota de la Patagonia en kayak o navegación."
              tags={["Kayak", "Aventura"]}
              image="/images/tours/ensenada-perez.jpg"
              gradient="from-slate-700 to-slate-900"
              className="md:col-span-4 min-h-[320px]"
            />

            {/* Carretera Austral */}
            <TourCard
              title="Carretera Austral"
              description="Recorre la ruta escénica más espectacular de Chile. Paisajes de montaña, ríos turquesa y pueblos tradicionales."
              tags={["Ruta Panorámica", "Multiday"]}
              image="/images/tours/carretera-austral.jpg"
              gradient="from-green-600 to-teal-700"
              className="md:col-span-3 min-h-[280px]"
            />

            {/* Parque Nacional Ventisqueros */}
            <TourCard
              title="Ventisqueros"
              description="Glaciares colgantes y trekking de altura. Experimenta la Patagonia en su máxima expresión."
              tags={["Glaciar", "Trekking"]}
              image="/images/tours/ventisqueros.jpg"
              gradient="from-cyan-600 to-blue-800"
              className="md:col-span-4 min-h-[280px]"
            />

            {/* Pesca Deportiva */}
            <TourCard
              title="Pesca Deportiva"
              description="Ríos y lagos repletos de truchas y salmones. Experiencia para pescadores de todos los niveles con guías expertos."
              tags={["Pesca", "Medio Día"]}
              image="/images/tours/pesca-deportiva.jpg"
              gradient="from-orange-600 via-red-600 to-orange-700"
              className="md:col-span-5 min-h-[280px]"
            />
          </div>

          {/* Note about images */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 text-sm">
              Sube tus fotos en /public/images/tours/ para personalizar cada destino
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-8 bg-[#0A0A0A] relative overflow-hidden" id="contacto">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-cyan-950/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-6 block">
              Comienza tu aventura
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Tu Próximo Viaje<br />Empieza Aquí
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Contáctanos para diseñar tu experiencia perfecta en Aysén. Estamos listos para hacer realidad tu viaje soñado.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {/* Phone */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold mb-2">Teléfono</h4>
                  <p className="text-gray-400 text-sm">+56 9 XXXX XXXX</p>
                </div>
              </div>

              {/* Email */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl p-8 border border-white/10 hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold mb-2">Email</h4>
                  <p className="text-gray-400 text-sm">contacto@jypturismo.cl</p>
                </div>
              </div>

              {/* Location */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold mb-2">Ubicación</h4>
                  <p className="text-gray-400 text-sm">Aysén, Chile</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/56XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/30 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Escríbenos por WhatsApp</span>
              </a>
              <a
                href="mailto:contacto@jypturismo.cl"
                className="relative group bg-white/5 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
              >
                <span className="relative z-10">Enviar Email</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl py-16 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-black text-white">JYP</span>
                </div>
                <span className="text-2xl font-black text-white">JYP Turismo</span>
              </div>
              <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                Tu guía experto para descubrir la magia de la Patagonia de Aysén.
                Experiencias auténticas en la región más prístina de Chile.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Enlaces</h4>
              <ul className="space-y-3">
                <li><a href="#tours" className="text-gray-400 hover:text-cyan-400 transition-colors font-light">Nuestros Tours</a></li>
                <li><a href="#contacto" className="text-gray-400 hover:text-cyan-400 transition-colors font-light">Contacto</a></li>
                <li><Link href="/login" className="text-gray-500 hover:text-gray-400 transition-colors font-light text-sm">Acceso operadores</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Síguenos</h4>
              <div className="flex gap-3">
                <a href="#" className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-light">
              &copy; {new Date().getFullYear()} JYP Turismo. Región de Aysén, Chile. Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-xs font-light">
              Diseñado con pasión por la Patagonia
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
