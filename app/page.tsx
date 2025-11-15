'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

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
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {image && !imgError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60 group-hover:from-black/40 group-hover:via-black/20 group-hover:to-black/50 transition-all duration-500"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`relative z-10 p-8 ${featured ? 'md:p-12' : 'md:p-8'} h-full flex flex-col justify-between`}>
        <div>
          {featured && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6"
            >
              Destacado
            </motion.span>
          )}
          <h3 className={`font-black text-white mb-4 leading-[0.95] transition-transform duration-500 group-hover:translate-x-2 ${featured ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>
            {title}
          </h3>
          <p className={`text-white/95 leading-relaxed ${featured ? 'text-lg mb-8' : 'text-base mb-6'}`}>
            {description}
          </p>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
      ></div>
    </motion.div>
  );
};

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split text for animation
  const AnimatedText = ({ children, delay = 0 }: { children: string; delay?: number }) => {
    const words = children.split(' ');
    return (
      <span>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: delay + i * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block"
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="bg-white" ref={containerRef}>
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 origin-left z-[100]"
        style={{ scaleX: smoothProgress }}
      />

      {/* Minimal Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center"
            >
              <span className="text-xl font-black text-white">J&P</span>
            </motion.div>
            <span className="text-xl font-black text-gray-900 tracking-tighter">J&P Turismo</span>
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 text-sm font-bold transition-all duration-300"
          >
            Admin
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Oversized Typography */}
        <section className="relative min-h-screen flex items-center justify-center px-8 md:px-16 py-32 overflow-hidden bg-white">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-[1600px] mx-auto w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left: Kinetic Typography */}
              <div className="space-y-12">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-block px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                  >
                    Patagonia · Aysén
                  </motion.div>

                  <h1 className="text-[clamp(3rem,8vw,7rem)] font-black text-gray-900 leading-[0.9] tracking-tighter mb-8">
                    <AnimatedText delay={0.3}>
                      Explora
                    </AnimatedText>
                    <br />
                    <AnimatedText delay={0.5}>
                      lo inexplorado
                    </AnimatedText>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light"
                  >
                    Experiencias auténticas en glaciares, fiordos y
                    la Carretera Austral desde Puerto Aysén.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-sm text-gray-400 mt-6 uppercase tracking-widest"
                  >
                    Temporada Nov — Mar
                  </motion.p>
                </div>

                {/* Contact Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.a
                    href="https://wa.me/56XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-5 bg-gray-900 text-white rounded-2xl font-bold transition-all duration-300 hover:bg-gray-800 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="relative z-10">WhatsApp</span>
                  </motion.a>

                  <motion.a
                    href="tel:+56XXXXXXXXX"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-5 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+56 9 XXXX XXXX</span>
                  </motion.a>
                </motion.div>
              </div>

              {/* Right: Image Mosaic */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { src: '/images/tours/laguna-san-rafael.jpg', span: 'col-span-2' },
                  { src: '/images/tours/capillas-marmol.jpg', span: '' },
                  { src: '/images/tours/queulat.jpg', span: '' },
                ].map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
                    className={`relative ${img.span} h-[300px] rounded-3xl overflow-hidden shadow-xl`}
                  >
                    <Image
                      src={img.src}
                      alt={`Patagonia ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Tours Section */}
        <section className="py-40 md:py-56 px-8 md:px-16 bg-gray-50 relative" id="tours">
          <div className="max-w-[1600px] mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24"
            >
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 origin-left"
              />
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-gray-900 mb-8 leading-[0.95] tracking-tighter">
                Nuestros Tours
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl font-light leading-relaxed">
                Expediciones diseñadas para conectarte con la esencia pura de la Patagonia de Aysén.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <TourCard
                title="Laguna San Rafael"
                description="Navegación hasta el imponente Glaciar San Rafael, parte del Campo de Hielo Norte. Observa témpanos de hielo azul flotando en aguas cristalinas."
                tags={["Navegación", "Día Completo", "Glaciar"]}
                image="/images/tours/laguna-san-rafael.jpg"
                gradient="from-blue-600 via-cyan-600 to-blue-700"
                className="md:col-span-7 md:row-span-2 min-h-[600px]"
                featured
              />

              <TourCard
                title="Capillas del Mármol"
                description="Explora las formaciones de mármol más espectaculares del mundo. Colores turquesa y azul cambian con las estaciones."
                tags={["Navegación", "Fotografía"]}
                image="/images/tours/capillas-marmol.jpg"
                gradient="from-cyan-500 via-blue-600 to-indigo-600"
                className="md:col-span-5 min-h-[280px]"
              />

              <TourCard
                title="Parque Nacional Queulat"
                description="Ventisquero Colgante y bosques milenarios. Una de las postales más icónicas de Aysén."
                tags={["Trekking", "Naturaleza"]}
                image="/images/tours/queulat.jpg"
                gradient="from-emerald-600 to-green-700"
                className="md:col-span-5 min-h-[280px]"
              />

              <TourCard
                title="Full Mármol desde Puerto Sánchez"
                description="Navegación completa por las Cuevas y Capillas de Mármol. Incluye recorrido por Catedral de Mármol."
                tags={["Navegación", "Día Completo"]}
                image="/images/tours/puerto-sanchez.jpg"
                gradient="from-blue-500 via-violet-600 to-purple-600"
                className="md:col-span-5 min-h-[320px]"
              />

              <TourCard
                title="Ensenada Pérez"
                description="Fiordos prístinos y aguas glaciares. Conecta con la naturaleza más remota de la Patagonia."
                tags={["Kayak", "Aventura"]}
                image="/images/tours/ensenada-perez.jpg"
                gradient="from-slate-700 to-slate-900"
                className="md:col-span-4 min-h-[320px]"
              />

              <TourCard
                title="Carretera Austral"
                description="Recorre la ruta escénica más espectacular de Chile. Paisajes de montaña y ríos turquesa."
                tags={["Ruta Panorámica", "Multiday"]}
                image="/images/tours/carretera-austral.jpg"
                gradient="from-green-600 to-teal-700"
                className="md:col-span-3 min-h-[280px]"
              />

              <TourCard
                title="Ventisqueros"
                description="Glaciares colgantes y trekking de altura. Experimenta la Patagonia en su máxima expresión."
                tags={["Glaciar", "Trekking"]}
                image="/images/tours/ventisqueros.jpg"
                gradient="from-cyan-600 to-blue-800"
                className="md:col-span-4 min-h-[280px]"
              />

              <TourCard
                title="Pesca Deportiva"
                description="Ríos y lagos repletos de truchas y salmones. Experiencia para pescadores de todos los niveles."
                tags={["Pesca", "Medio Día"]}
                image="/images/tours/pesca-deportiva.jpg"
                gradient="from-orange-600 via-red-600 to-orange-700"
                className="md:col-span-5 min-h-[280px]"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-32 md:py-40 px-8 md:px-16 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-20">
              <div className="max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <div className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                    J&P Turismo
                  </div>
                  <p className="text-lg text-gray-500 leading-relaxed">
                    Experiencias auténticas de Patagonia en Aysén, Chile.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-6"
              >
                {['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'].map((path, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-2xl flex items-center justify-center transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                  </motion.a>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="border-t border-gray-100 pt-10"
            >
              <p className="text-gray-400 text-sm text-center">
                &copy; {new Date().getFullYear()} J&P Turismo · Región de Aysén, Chile
              </p>
            </motion.div>
          </div>
        </footer>
      </main>
    </div>
  );
}
