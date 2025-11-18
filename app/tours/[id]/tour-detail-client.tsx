'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

interface TourDetailClientProps {
  tour: Tour;
  siteSettings: SiteSettings | null;
}

export default function TourDetailClient({ tour, siteSettings }: TourDetailClientProps) {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div ref={containerRef} className="bg-black min-h-screen">
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="px-6 md:px-12 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-white/60 group-hover:text-white font-bold text-sm uppercase tracking-wider transition-colors">
              Volver
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-xs font-black text-white">{siteSettings?.logoText || 'J&P'}</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight hidden sm:block">
              {siteSettings?.companyName || 'J&P Turismo'}
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Fullscreen */}
      <motion.section
        style={{ y: heroY }}
        className="relative h-screen flex items-end overflow-hidden"
      >
        {/* Background Image with Parallax */}
        <div className="absolute inset-0">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover"
            quality={90}
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full px-6 md:px-12 pb-20 md:pb-32 max-w-screen-2xl mx-auto"
        >
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {tour.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-xs font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-6"
          >
            {tour.title}
          </motion.h1>

          {/* Package Badge */}
          {tour.packageName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl shadow-2xl shadow-cyan-500/30"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-black text-base uppercase tracking-wide">
                {tour.packageName}
              </span>
            </motion.div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Scroll</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
              >
                <div className="w-1 h-2 bg-white/60 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Content Section */}
      <section className="relative bg-black py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-20">

          {/* Description */}
          {(tour.description || tour.packageDescription) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <h2 className="text-xs text-white/40 uppercase tracking-widest font-black mb-6">Sobre este tour</h2>
              <p className="text-2xl md:text-4xl text-white/90 leading-relaxed font-light">
                {tour.packageDescription || tour.description}
              </p>
            </motion.div>
          )}

          {/* Price & Duration Grid */}
          {(tour.packagePrice || tour.packageDuration) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {tour.packagePrice && (
                <div className="p-8 md:p-12 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-black mb-4">Precio</p>
                  <p className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    {tour.packagePrice}
                  </p>
                </div>
              )}
              {tour.packageDuration && (
                <div className="p-8 md:p-12 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-black mb-4">Duración</p>
                  <p className="text-4xl md:text-6xl font-black text-white">
                    {tour.packageDuration}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Includes */}
          {tour.packageIncludes && tour.packageIncludes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-xs text-white/40 uppercase tracking-widest font-black">Lo que incluye este tour</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.packageIncludes.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-start gap-4 p-6 bg-gradient-to-r from-white/5 to-transparent hover:from-cyan-500/10 hover:to-teal-500/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg md:text-xl text-white/90 leading-relaxed font-light">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-12 border-t border-white/10"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                  ¿Listo para la aventura?
                </h3>
                <p className="text-lg text-white/60 font-light">
                  Contáctanos por WhatsApp y te ayudaremos a planificar tu viaje perfecto
                </p>
              </div>

              <a
                href={`https://wa.me/${siteSettings?.whatsappNumber || ''}?text=Hola, me interesa el tour "${tour.title}"${tour.packageName ? ` - ${tour.packageName}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-2xl font-black text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Consultar por WhatsApp</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
