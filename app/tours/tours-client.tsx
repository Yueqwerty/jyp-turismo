'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

interface Tour {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  image: string;
  gradient: string;
  packageName?: string | null;
  packageDescription?: string | null;
  packagePrice?: string | null;
  packageDuration?: string | null;
  packageIncludes?: string[];
}

interface SiteSettings {
  logoText: string;
  companyName: string;
  whatsappNumber?: string | null;
}

interface ToursPage {
  heroTitle: string;
  heroSubtitle: string;
}

interface ToursClientProps {
  tours: Tour[];
  siteSettings: SiteSettings | null;
  toursPage: ToursPage | null;
}

export default function ToursClient({ tours, siteSettings, toursPage }: ToursClientProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      {/* Header Navigation - Ultra Clean */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-neutral-100"
      >
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-white tracking-tight">{siteSettings?.logoText || 'J&P'}</span>
                </div>
              </motion.div>
              <span className="font-medium text-neutral-900 hidden sm:block tracking-tight">
                {siteSettings?.companyName || 'J&P Turismo'}
              </span>
            </Link>

            <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Volver</span>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Awwwards Style */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-neutral-200 shadow-sm">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900">
                  Paquetes Turísticos
                </span>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-neutral-900 leading-[0.9] tracking-tighter mb-8">
              {toursPage?.heroTitle || 'Nuestros Paquetes'}
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl leading-relaxed">
              {toursPage?.heroSubtitle || 'Selección curada de experiencias'}
            </p>
          </motion.div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-1/2 right-0 w-1/3 h-96 bg-gradient-to-l from-neutral-100 to-transparent opacity-50" />
      </section>

      {/* Tours Grid - Professional Layout */}
      <section className="relative py-32 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
            {tours.map((tour, index) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={index}
                whatsappNumber={siteSettings?.whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-[1800px] mx-auto px-8 lg:px-16 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{siteSettings?.logoText || 'J&P'}</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {siteSettings?.companyName || 'J&P Turismo'}
              </span>
            </div>
            <p className="text-sm text-neutral-400">
              © {new Date().getFullYear()} Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Tour Card Component
function TourCard({ tour, index, whatsappNumber }: { tour: Tour; index: number; whatsappNumber?: string | null }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group relative"
    >
      <div className="relative bg-white border border-neutral-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-900/10 hover:border-neutral-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          {tour.packageName && (
            <div className="absolute top-6 left-6">
              <div className="bg-white px-4 py-2 shadow-lg">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-900">
                  {tour.packageName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 leading-tight tracking-tight mb-3 group-hover:text-neutral-700 transition-colors">
              {tour.title}
            </h3>

            {/* Tags */}
            {tour.tags && tour.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tour.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-neutral-100 text-neutral-600 font-medium tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          {(tour.packageDescription || tour.description) && (
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
              {tour.packageDescription || tour.description}
            </p>
          )}

          {/* Price & Duration */}
          {(tour.packagePrice || tour.packageDuration) && (
            <div className="flex items-center gap-8 pt-4 border-t border-neutral-100">
              {tour.packagePrice && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Precio</p>
                  <p className="text-xl font-bold text-neutral-900">{tour.packagePrice}</p>
                </div>
              )}
              {tour.packageDuration && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Duración</p>
                  <p className="text-sm font-semibold text-neutral-900">{tour.packageDuration}</p>
                </div>
              )}
            </div>
          )}

          {/* Includes */}
          {tour.packageIncludes && tour.packageIncludes.length > 0 && (
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">Incluye</p>
              <ul className="space-y-2">
                {tour.packageIncludes.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <svg className="w-4 h-4 text-neutral-900 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
              </ul>
              {tour.packageIncludes.length > 3 && (
                <p className="text-xs text-neutral-500 mt-3">
                  +{tour.packageIncludes.length - 3} más
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <a
            href={`https://wa.me/${whatsappNumber || ''}?text=Hola, me interesa el paquete "${tour.title}"`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative block w-full overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 py-4 px-6">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-sm font-bold text-white tracking-wide">Consultar Disponibilidad</span>
              <svg className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
