'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

interface ToursClientProps {
  tours: Tour[];
  siteSettings: SiteSettings | null;
}

export default function ToursClient({ tours, siteSettings }: ToursClientProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="bg-black min-h-screen">
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5"
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

      {/* Hero Header */}
      <section ref={heroRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-screen-xl mx-auto px-6 md:px-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500" />
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold">Catálogo</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6"
          >
            Nuestros
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Paquetes
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed"
          >
            Explora toda nuestra oferta de experiencias en la Patagonia Aysén. Compara precios, duraciones y encuentra el tour perfecto para tu aventura.
          </motion.p>
        </motion.div>
      </section>

      {/* Tours Catalog */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 pb-24">
        {/* Dotted border container */}
        <div className="border-2 border-dotted border-white/20 rounded-3xl p-8 md:p-12 lg:p-16 space-y-16">
          {tours.map((tour, index) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Tour Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Image Column */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Tags on image */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {tour.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Number */}
                  <div className="flex items-center gap-4">
                    <span className="text-6xl md:text-7xl font-black text-white/10 leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {tour.packageName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-400 font-black text-xs uppercase tracking-wide">
                          {tour.packageName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
                    {tour.title}
                  </h2>

                  {/* Description */}
                  {(tour.packageDescription || tour.description) && (
                    <p className="text-base md:text-lg text-white/70 leading-relaxed font-light">
                      {tour.packageDescription || tour.description}
                    </p>
                  )}

                  {/* Price & Duration */}
                  {(tour.packagePrice || tour.packageDuration) && (
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      {tour.packagePrice && (
                        <div>
                          <p className="text-xs text-white/30 uppercase tracking-widest font-black mb-1">Precio</p>
                          <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                            {tour.packagePrice}
                          </p>
                        </div>
                      )}
                      {tour.packageDuration && (
                        <div>
                          <p className="text-xs text-white/30 uppercase tracking-widest font-black mb-1">Duración</p>
                          <p className="text-2xl md:text-3xl font-black text-white">
                            {tour.packageDuration}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Includes */}
                  {tour.packageIncludes && tour.packageIncludes.length > 0 && (
                    <div className="pt-4">
                      <p className="text-xs text-white/30 uppercase tracking-widest font-black mb-3">Incluye:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {tour.packageIncludes.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="flex-shrink-0 w-5 h-5 rounded-md bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-white/80 leading-relaxed font-light">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div className="pt-4">
                    <a
                      href={`https://wa.me/${siteSettings?.whatsappNumber || ''}?text=Hola, me interesa el tour "${tour.title}"${tour.packageName ? ` - ${tour.packageName}` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl font-bold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 group/btn"
                    >
                      <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>Consultar disponibilidad</span>
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Separator (except for last item) */}
              {index < tours.length - 1 && (
                <div className="mt-16 pt-16 border-t-2 border-dotted border-white/10" />
              )}
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
