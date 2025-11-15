'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ${className}`}
    >
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {image && !imgError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className={`relative z-10 p-6 ${featured ? 'md:p-10' : 'md:p-6'} h-full flex flex-col justify-between`}>
        <div>
          {featured && (
            <span className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Destacado
            </span>
          )}
          <h3 className={`font-bold text-white mb-3 leading-tight transition-transform duration-300 group-hover:translate-y-[-4px] ${featured ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
            {title}
          </h3>
          <p className={`text-white/90 leading-relaxed ${featured ? 'text-base mb-6' : 'text-sm mb-4'}`}>
            {description}
          </p>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-md text-white text-xs font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-500"></div>
    </motion.div>
  );
};

// Professional Navigation Icons
const NavIcon = ({ type, className = "" }: { type: string; className?: string }) => {
  const icons = {
    home: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    tours: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    contact: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    login: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  return icons[type as keyof typeof icons] || null;
};

// Advanced Side Navigation
const SideNav = ({ activeSection, scrollProgress }: { activeSection: string; scrollProgress: number }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: 'home' },
    { id: 'tours', label: 'Nuestros Tours', icon: 'tours' },
    { id: 'contacto', label: 'Contacto', icon: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen w-20 lg:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 z-50 flex flex-col"
    >
      {/* Scroll Progress Indicator */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gray-100">
        <motion.div
          className="w-full bg-gradient-to-b from-blue-600 to-cyan-600"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
            <span className="text-xl font-black text-white">J&P</span>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">J&P Turismo</h2>
            <p className="text-xs text-gray-500 font-medium">Patagonia Aysén</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <NavIcon
                  type={item.icon}
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <span className="hidden lg:block font-semibold text-sm tracking-tight">{item.label}</span>

                {/* Item Number */}
                <span className={`hidden lg:block ml-auto text-xs font-bold ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>
                  0{index + 1}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <Link
          href="/login"
          className="hidden lg:flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 group"
        >
          <NavIcon type="login" className="w-4 h-4" />
          <span className="font-medium">Acceso operadores</span>
        </Link>
      </div>
    </motion.nav>
  );
};

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Scroll spy and progress
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'tours', 'contacto'];
      const scrollPosition = window.scrollY + 200;

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));

      // Update active section
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-50">
      <SideNav activeSection={activeSection} scrollProgress={scrollProgress} />

      {/* Main Content */}
      <main className="ml-20 lg:ml-72">
        {/* Hero Section */}
        <section id="inicio" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Abstract Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-100/20 rounded-full blur-3xl"></div>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <motion.div
            style={{ opacity, scale, y }}
            className="relative z-10 text-center px-6 max-w-6xl mx-auto py-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-gray-200/50 text-gray-700 rounded-full text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Experiencias auténticas en Patagonia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tight"
            >
              Descubre <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                la Patagonia
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Glaciares ancestrales, lagos cristalinos y montañas imponentes en la región más prístina de Chile
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#tours"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Explorar destinos</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#contacto"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-xl font-bold hover:border-gray-300 hover:bg-white transition-all duration-300"
              >
                Contactar
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Scroll</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1">
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tours Section */}
        <section className="py-32 px-6 md:px-12 bg-white relative" id="tours">
          <div className="max-w-[1600px] mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Experiencias</span>
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Nuestros Tours
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
                Cada expedición está cuidadosamente diseñada para conectarte con la esencia pura de la Patagonia de Aysén,
                combinando aventura, naturaleza y experiencias auténticas.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <TourCard
                title="Laguna San Rafael"
                description="Navegación hasta el imponente Glaciar San Rafael, parte del Campo de Hielo Norte. Observa témpanos de hielo azul flotando en aguas cristalinas."
                tags={["Navegación", "Día Completo", "Glaciar"]}
                image="/images/tours/laguna-san-rafael.jpg"
                gradient="from-blue-600 via-cyan-600 to-blue-700"
                className="md:col-span-7 md:row-span-2 min-h-[500px]"
                featured
              />

              <TourCard
                title="Capillas del Mármol"
                description="Explora las formaciones de mármol más espectaculares del mundo. Colores turquesa y azul cambian con las estaciones."
                tags={["Navegación", "Fotografía"]}
                image="/images/tours/capillas-marmol.jpg"
                gradient="from-cyan-500 via-blue-600 to-indigo-600"
                className="md:col-span-5 min-h-[240px]"
              />

              <TourCard
                title="Parque Nacional Queulat"
                description="Ventisquero Colgante y bosques milenarios. Una de las postales más icónicas de Aysén."
                tags={["Trekking", "Naturaleza"]}
                image="/images/tours/queulat.jpg"
                gradient="from-emerald-600 to-green-700"
                className="md:col-span-5 min-h-[240px]"
              />

              <TourCard
                title="Full Mármol desde Puerto Sánchez"
                description="Navegación completa por las Cuevas y Capillas de Mármol. Incluye recorrido por Catedral de Mármol."
                tags={["Navegación", "Día Completo"]}
                image="/images/tours/puerto-sanchez.jpg"
                gradient="from-blue-500 via-violet-600 to-purple-600"
                className="md:col-span-5 min-h-[280px]"
              />

              <TourCard
                title="Ensenada Pérez"
                description="Fiordos prístinos y aguas glaciares. Conecta con la naturaleza más remota de la Patagonia."
                tags={["Kayak", "Aventura"]}
                image="/images/tours/ensenada-perez.jpg"
                gradient="from-slate-700 to-slate-900"
                className="md:col-span-4 min-h-[280px]"
              />

              <TourCard
                title="Carretera Austral"
                description="Recorre la ruta escénica más espectacular de Chile. Paisajes de montaña y ríos turquesa."
                tags={["Ruta Panorámica", "Multiday"]}
                image="/images/tours/carretera-austral.jpg"
                gradient="from-green-600 to-teal-700"
                className="md:col-span-3 min-h-[240px]"
              />

              <TourCard
                title="Ventisqueros"
                description="Glaciares colgantes y trekking de altura. Experimenta la Patagonia en su máxima expresión."
                tags={["Glaciar", "Trekking"]}
                image="/images/tours/ventisqueros.jpg"
                gradient="from-cyan-600 to-blue-800"
                className="md:col-span-4 min-h-[240px]"
              />

              <TourCard
                title="Pesca Deportiva"
                description="Ríos y lagos repletos de truchas y salmones. Experiencia para pescadores de todos los niveles."
                tags={["Pesca", "Medio Día"]}
                image="/images/tours/pesca-deportiva.jpg"
                gradient="from-orange-600 via-red-600 to-orange-700"
                className="md:col-span-5 min-h-[240px]"
              />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-32 px-6 md:px-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 relative overflow-hidden" id="contacto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Contacto</span>
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                Planifica tu<br />próxima aventura
              </h2>

              <p className="text-xl text-gray-600 mb-16 max-w-2xl font-light leading-relaxed">
                Nuestro equipo está listo para diseñar tu experiencia perfecta en Aysén.
                Cada viaje es único y personalizado.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {[
                  { title: 'Teléfono', value: '+56 9 XXXX XXXX', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'blue' },
                  { title: 'Email', value: 'contacto@jypturismo.cl', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'cyan' },
                  { title: 'Ubicación', value: 'Aysén, Chile', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', color: 'purple' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/80 transition-all duration-300"
                  >
                    <div className={`w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <svg className={`w-7 h-7 text-${item.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h4 className="text-gray-900 font-bold mb-2 text-sm uppercase tracking-wider">{item.title}</h4>
                    <p className="text-gray-600 font-medium">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/56XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-green-600/30 hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="mailto:contacto@jypturismo.cl"
                  className="flex-1 px-10 py-5 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-xl font-bold hover:border-gray-300 hover:bg-white transition-all duration-300"
                >
                  Enviar email
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-16 px-6 md:px-12 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <span className="text-xl font-black text-white">J&P</span>
                  </div>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">J&P Turismo</span>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-md font-light">
                  Expertos en experiencias auténticas de Patagonia. Descubre la belleza natural
                  de Aysén con guías locales especializados.
                </p>
              </div>
              <div>
                <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-sm">Navegación</h4>
                <ul className="space-y-3">
                  <li><a href="#tours" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tours</a></li>
                  <li><a href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contacto</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-sm">Social</h4>
                <div className="flex gap-3">
                  {['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'].map((path, i) => (
                    <a key={i} href="#" className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 group">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm font-medium">
                &copy; {new Date().getFullYear()} J&P Turismo. Región de Aysén, Chile.
              </p>
              <p className="text-gray-400 text-xs font-medium tracking-wide">
                Diseñado para la Patagonia
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
