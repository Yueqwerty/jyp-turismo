'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef, memo } from 'react';

interface HeroSection {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  whatsappNumber: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  email: string;
  heroImage: string;
  heroImageAlt: string;
  heroBadgeText: string;
  ctaWhatsappText: string;
  ctaPhoneText: string;
}

interface Tour {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  image: string;
  gradient: string;
  colSpan: number;
  rowSpan: number;
  minHeight: string;
  featured: boolean;
  order: number;
  packageName?: string | null;
  packagePrice?: string | null;
  packageDuration?: string | null;
  packageIncludes?: string[];
}

interface ToursSection {
  sectionTitle: string;
  sectionDescription: string;
}

interface FooterSettings {
  brandTitle: string;
  brandDescription: string;
  copyrightText: string;
  newsletterEnabled: boolean;
  newsletterTitle: string;
  newsletterPlaceholder: string;
}

interface SiteSettings {
  logoText: string;
  companyName: string;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}

interface HomeClientProps {
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  siteSettings: SiteSettings;
}

const TourCard = memo(function TourCard({ tour, index, siteSettings }: { tour: Tour; index: number; siteSettings: SiteSettings }) {
  const [imgError, setImgError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  // Determinar tamaño basado en colSpan y rowSpan
  const getCardSize = () => {
    if (tour.featured || tour.colSpan >= 7) {
      return 'col-span-1 md:col-span-2 h-[400px] md:h-[500px]';
    } else if (tour.colSpan >= 5) {
      return 'col-span-1 h-[350px] md:h-[500px]';
    } else {
      return 'col-span-1 h-[280px] md:h-[300px]';
    }
  };

  const hasPackageInfo = tour.packageName || tour.packagePrice || tour.packageDuration;

  const toggleInfo = () => {
    if (hasPackageInfo) {
      setShowInfo(!showInfo);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 0.45, 0.27, 0.9]
      }}
      onClick={toggleInfo}
      className={`${getCardSize()} group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500`}
    >
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        {tour.image && !imgError ? (
          <>
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
              quality={85}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}
      </div>

      {/* Content - Always visible */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4 md:p-6">
        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.15 }}
          className="flex flex-wrap gap-1.5 mb-2 md:mb-3"
        >
          {tour.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 text-[10px] md:text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.2 }}
          className={`font-bold text-white leading-tight mb-2 ${
            tour.featured || tour.colSpan >= 7 ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'
          }`}
        >
          {tour.title}
        </motion.h3>

        {/* Description (only for large cards when info not shown) */}
        {tour.description && (tour.featured || tour.colSpan >= 7) && !showInfo && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.08 + 0.25 }}
            className="text-white/80 text-xs md:text-base leading-relaxed font-light line-clamp-2"
          >
            {tour.description}
          </motion.p>
        )}

        {/* Package indicator - Show when has package info */}
        {hasPackageInfo && !showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2 text-white/90 text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Tap para ver detalles</span>
          </motion.div>
        )}
      </div>

      {/* Package Info Overlay - Slides from bottom to 75% */}
      <AnimatePresence>
        {showInfo && hasPackageInfo && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '25%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.21, 0.45, 0.27, 0.9] }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(false);
              }}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="h-full overflow-y-auto p-5 md:p-6 pt-14">
              {/* Package Badge */}
              {tour.packageName && (
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-900 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wide">
                    Paquete Especial
                  </span>
                </div>
              )}

              {/* Package Name */}
              {tour.packageName && (
                <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight">
                  {tour.packageName}
                </h4>
              )}

              {/* Price & Duration */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-200">
                {tour.packagePrice && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-black text-cyan-600">
                      {tour.packagePrice.split(' ')[0]}
                    </span>
                    {tour.packagePrice.includes(' ') && (
                      <span className="text-xs md:text-sm text-slate-500 font-medium">
                        {tour.packagePrice.split(' ').slice(1).join(' ')}
                      </span>
                    )}
                  </div>
                )}
                {tour.packageDuration && (
                  <div className="text-xs md:text-sm text-cyan-700 font-bold px-2.5 py-1 bg-cyan-50 rounded-lg">
                    {tour.packageDuration}
                  </div>
                )}
              </div>

              {/* Includes */}
              {tour.packageIncludes && tour.packageIncludes.length > 0 && (
                <div className="space-y-2.5 mb-5">
                  <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Incluye:</p>
                  <div className="space-y-2">
                    {tour.packageIncludes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <a
                href={`https://wa.me/${siteSettings?.whatsappNumber || ''}?text=Hola, me interesa el tour "${tour.title}"${tour.packageName ? ` - ${tour.packageName}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full mt-2 px-5 py-3 md:py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 group/btn"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Consultar por WhatsApp</span>
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default function HomeClient({
  heroSection,
  toursSection,
  tours,
  footerSettings,
  siteSettings,
}: HomeClientProps) {
  const containerRef = useRef(null);
  const toursContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: toursContainerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '15%']);

  return (
    <div ref={containerRef} className="bg-white">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200"
      >
        <div className="px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
              <span className="text-sm md:text-base font-black text-white">{siteSettings.logoText}</span>
            </div>
            <span className="text-sm md:text-base font-black text-slate-900 tracking-tight">
              {siteSettings.companyName}
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            {siteSettings.whatsappNumber && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors duration-300"
              >
                Contactar
              </motion.a>
            )}

            <Link
              href="/login"
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-all duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="relative pt-14 md:pt-16">
        {/* Split Screen Layout - Stack on mobile, side by side on desktop */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* LEFT PANEL - HERO/BRANDING */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.27, 0.9] }}
            className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] relative overflow-hidden flex items-center justify-center p-6 md:p-10 lg:p-14 lg:w-[44%] border-b lg:border-b-0 lg:border-r border-slate-200 bg-gradient-to-br from-cyan-50/50 to-white"
          >
            <div className="max-w-xl w-full space-y-6 md:space-y-8 relative z-10">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex items-center gap-2 md:gap-3"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-600" />
                  <div className="w-6 md:w-8 h-px bg-cyan-600/30" />
                </div>
                <span className="text-[10px] md:text-xs text-cyan-900/70 uppercase tracking-[0.2em] font-bold">
                  {heroSection.tagline}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <h1 className="text-[clamp(2.5rem,10vw,7rem)] font-black leading-[0.9] mb-4 md:mb-5 tracking-tighter">
                  <span className="block text-slate-900">
                    {heroSection.titleLine1}
                  </span>
                  <span className="block text-cyan-600">
                    {heroSection.titleLine2}
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base md:text-lg text-slate-600 leading-relaxed font-light"
              >
                {heroSection.description}
              </motion.p>

              {/* Social Media Contact Box - 2x2 Grid */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 shadow-lg"
              >
                <div className="grid grid-cols-2 grid-rows-2">
                  {/* WhatsApp */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${heroSection.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-white border-r border-b border-slate-200 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight">WhatsApp</span>
                  </motion.a>

                  {/* Facebook */}
                  {heroSection.facebookUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={heroSection.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-white border-b border-slate-200 hover:bg-blue-50 transition-all duration-300"
                    >
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight">Facebook</span>
                    </motion.a>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-slate-50 border-b border-slate-200 opacity-40">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-[10px] md:text-xs font-black text-slate-400 tracking-tight">Facebook</span>
                    </div>
                  )}

                  {/* Instagram */}
                  {heroSection.instagramUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={heroSection.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-white border-r border-slate-200 hover:bg-pink-50 transition-all duration-300"
                    >
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight">Instagram</span>
                    </motion.a>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-slate-50 border-r border-slate-200 opacity-40">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      <span className="text-[10px] md:text-xs font-black text-slate-400 tracking-tight">Instagram</span>
                    </div>
                  )}

                  {/* Email */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${heroSection.email}`}
                    className="group relative flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 bg-white hover:bg-cyan-50 transition-all duration-300"
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-cyan-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tight">Correo</span>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT PANEL - SCROLLABLE TOURS */}
          <div className="lg:w-[56%] w-full">
            <motion.div
              ref={toursContainerRef}
              style={{ y: backgroundY }}
              className="min-h-screen p-4 md:p-8 lg:p-14"
            >
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }}
                className="mb-8 md:mb-12"
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-3 md:mb-4">
                  {toursSection.sectionTitle}
                </h2>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl font-light">
                  {toursSection.sectionDescription}
                </p>
              </motion.div>

              {/* Bento Grid of Tours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {tours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} siteSettings={siteSettings} />
                ))}
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-6 md:mb-10">
                  <div className="md:col-span-2">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 md:mb-3 leading-tight whitespace-pre-line">
                      {footerSettings.brandTitle}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light max-w-md">
                      {footerSettings.brandDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Contacto
                    </h4>
                    <div className="space-y-2">
                      {siteSettings.email && (
                        <a
                          href={`mailto:${siteSettings.email}`}
                          className="block text-slate-600 hover:text-cyan-600 transition-colors duration-300 text-xs md:text-sm"
                        >
                          {siteSettings.email}
                        </a>
                      )}
                      {siteSettings.phone && (
                        <a
                          href={`tel:${siteSettings.phone}`}
                          className="block text-slate-600 hover:text-cyan-600 transition-colors duration-300 text-xs md:text-sm"
                        >
                          {siteSettings.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 md:pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 text-[10px] md:text-xs text-slate-400">
                  <p>{footerSettings.copyrightText}</p>
                  <p className="hidden md:block">Diseño moderno · Patagonia Aysén</p>
                </div>
              </motion.footer>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
