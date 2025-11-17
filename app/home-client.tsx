'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

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

const TourCard = ({ tour, index }: { tour: Tour; index: number }) => {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  // Determinar tamaño basado en colSpan y rowSpan
  const getCardSize = () => {
    if (tour.featured || tour.colSpan >= 7) {
      return 'col-span-2 row-span-2 h-[550px]';
    } else if (tour.colSpan >= 5) {
      return 'col-span-1 row-span-2 h-[550px]';
    } else {
      return 'col-span-1 row-span-1 h-[270px]';
    }
  };

  const hasPackageInfo = tour.packageName || tour.packagePrice || tour.packageDuration;

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${getCardSize()} group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500`}
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
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}
      </div>

      {/* Subtle glow on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(167, 139, 250, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-7">
        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.15 }}
          className="flex flex-wrap gap-1.5 mb-3"
        >
          {tour.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 text-xs font-semibold"
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
            tour.featured || tour.colSpan >= 7 ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
          }`}
        >
          {tour.title}
        </motion.h3>

        {/* Description (only for large cards when not hovering) */}
        {tour.description && (tour.featured || tour.colSpan >= 7) && !isHovered && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.08 + 0.25 }}
            className="text-white/80 text-sm md:text-base leading-relaxed font-light line-clamp-2"
          >
            {tour.description}
          </motion.p>
        )}

        {/* Package Info Overlay - Appears on Hover */}
        <AnimatePresence>
          {isHovered && hasPackageInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-xl p-6 md:p-7 flex flex-col justify-end"
            >
              {/* Package Badge */}
              {tour.packageName && (
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 rounded-full text-xs font-bold ring-1 ring-cyan-200">
                    Nuevo Paquete
                  </span>
                </div>
              )}

              {/* Package Name */}
              {tour.packageName && (
                <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                  {tour.packageName}
                </h4>
              )}

              {/* Price & Duration */}
              <div className="flex items-center gap-4 mb-4">
                {tour.packagePrice && (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                      {tour.packagePrice.split(' ')[0]}
                    </span>
                    {tour.packagePrice.includes(' ') && (
                      <span className="text-sm text-slate-500 font-medium">
                        {tour.packagePrice.split(' ').slice(1).join(' ')}
                      </span>
                    )}
                  </div>
                )}
                {tour.packageDuration && (
                  <div className="text-sm text-cyan-900/70 font-bold px-2.5 py-1 bg-cyan-50 rounded-lg">
                    {tour.packageDuration}
                  </div>
                )}
              </div>

              {/* Includes */}
              {tour.packageIncludes && tour.packageIncludes.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  <p className="text-xs font-bold text-cyan-900/60 uppercase tracking-wider">Incluye:</p>
                  {tour.packageIncludes.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-700 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <button className="w-full mt-auto px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-cyan-600/25 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                <span>Ver detalles</span>
                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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
    <div ref={containerRef} className="bg-gradient-to-br from-cyan-50/30 via-white to-teal-50/20">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-cyan-900/5"
      >
        <div className="px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-600/20 ring-1 ring-cyan-700/10">
              <span className="text-base font-black text-white">{siteSettings.logoText}</span>
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">
              {siteSettings.companyName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {siteSettings.whatsappNumber && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex px-5 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-violet-600 rounded-lg transition-colors duration-300"
              >
                Contactar
              </motion.a>
            )}

            <Link
              href="/login"
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded-lg transition-all duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="relative pt-16">
        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* LEFT PANEL - FIXED HERO/BRANDING */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.45, 0.27, 0.9] }}
            className="lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-[44%] relative overflow-hidden flex items-center justify-center p-6 md:p-10 lg:p-14 border-r border-cyan-900/10"
            style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 25%, #ecfeff 50%, #ffffff 75%, #f0fdfa 100%)'
            }}
          >
            {/* Organic pattern background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #0891b2 2%, transparent 0%), radial-gradient(circle at 75px 75px, #06b6d4 2%, transparent 0%)`,
              backgroundSize: '100px 100px'
            }} />

            {/* Accent shapes */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-teal-200/20 to-cyan-300/20 rounded-full blur-3xl" />

            <div className="max-w-xl w-full space-y-8 relative z-10">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-600" />
                  <div className="w-8 h-px bg-gradient-to-r from-cyan-600/60 to-transparent" />
                </div>
                <span className="text-xs text-cyan-900/70 uppercase tracking-[0.2em] font-bold">
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
                <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] mb-5 tracking-tighter">
                  <span className="block text-slate-900" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {heroSection.titleLine1}
                  </span>
                  <span className="block relative inline-block">
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-600 blur-2xl opacity-30" />
                    <span className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent" style={{
                      WebkitTextStroke: '0.5px rgba(6, 182, 212, 0.1)'
                    }}>
                      {heroSection.titleLine2}
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-slate-600 leading-relaxed font-light"
              >
                {heroSection.description}
              </motion.p>

              {/* Social Media Contact Box - Single container divided in 4 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative overflow-hidden rounded-3xl border-2 border-slate-900/10 shadow-2xl shadow-slate-900/5"
              >
                <div className="grid grid-cols-2 grid-rows-2">
                  {/* WhatsApp - Top Left */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${heroSection.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-emerald-400/20 via-white to-white border-r border-b border-slate-900/5 hover:from-emerald-400/30 hover:shadow-inner transition-all duration-500"
                  >
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60" />
                    <svg className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-xs font-black text-slate-700 tracking-tight">WhatsApp</span>
                  </motion.a>

                  {/* Facebook - Top Right */}
                  {heroSection.facebookUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={heroSection.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-bl from-blue-400/20 via-white to-white border-b border-slate-900/5 hover:from-blue-400/30 hover:shadow-inner transition-all duration-500"
                    >
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-blue-600 opacity-60" />
                      <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-black text-slate-700 tracking-tight">Facebook</span>
                    </motion.a>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-bl from-slate-50 via-white to-white border-b border-slate-900/5 opacity-40">
                      <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-black text-slate-400 tracking-tight">Facebook</span>
                    </div>
                  )}

                  {/* Instagram - Bottom Left */}
                  {heroSection.instagramUrl ? (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={heroSection.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-tr from-pink-400/20 via-white to-white border-r border-slate-900/5 hover:from-pink-400/30 hover:shadow-inner transition-all duration-500"
                    >
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-pink-600 opacity-60" />
                      <svg className="w-8 h-8 text-pink-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      <span className="text-xs font-black text-slate-700 tracking-tight">Instagram</span>
                    </motion.a>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-tr from-slate-50 via-white to-white border-r border-slate-900/5 opacity-40">
                      <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      <span className="text-xs font-black text-slate-400 tracking-tight">Instagram</span>
                    </div>
                  )}

                  {/* Email - Bottom Right */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`mailto:${heroSection.email}`}
                    className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-tl from-cyan-400/20 via-white to-white hover:from-cyan-400/30 hover:shadow-inner transition-all duration-500"
                  >
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-cyan-600 opacity-60" />
                    <svg className="w-8 h-8 text-cyan-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-black text-slate-700 tracking-tight">Correo</span>
                  </motion.a>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 pt-3"
              >
                {siteSettings.whatsappNumber && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${siteSettings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-2xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 hover:shadow-xl hover:shadow-cyan-600/30 transition-all duration-300"
                  >
                    <span>{heroSection.ctaWhatsappText}</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                )}

                {siteSettings.phone && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${siteSettings.phone}`}
                    className="flex-1 px-6 py-3.5 bg-white border-2 border-cyan-200 text-cyan-900 rounded-2xl font-bold text-center hover:border-cyan-400 hover:bg-cyan-50 transition-all duration-300"
                  >
                    {heroSection.ctaPhoneText}
                  </motion.a>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex items-center gap-3 pt-6 border-t border-cyan-100/60"
              >
                <span className="text-xs text-cyan-900/50 uppercase tracking-wider font-semibold">Síguenos</span>
                <div className="flex gap-2">
                  {siteSettings.instagramUrl && (
                    <a
                      href={siteSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 hover:border-cyan-300 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {siteSettings.facebookUrl && (
                    <a
                      href={siteSettings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-100 hover:border-cyan-300 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT PANEL - SCROLLABLE TOURS */}
          <div className="lg:ml-[44%] lg:w-[56%] w-full">
            <motion.div
              ref={toursContainerRef}
              style={{ y: backgroundY }}
              className="min-h-screen p-6 md:p-10 lg:p-14"
            >
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }}
                className="mb-12"
              >
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4">
                  {toursSection.sectionTitle}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-light">
                  {toursSection.sectionDescription}
                </p>
              </motion.div>

              {/* Bento Grid of Tours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} />
                ))}
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-24 pt-12 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                  <div className="md:col-span-2">
                    <h3 className="text-3xl font-black text-slate-900 mb-3 leading-tight whitespace-pre-line">
                      {footerSettings.brandTitle}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed font-light max-w-md">
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
                          className="block text-slate-600 hover:text-violet-600 transition-colors duration-300 text-sm"
                        >
                          {siteSettings.email}
                        </a>
                      )}
                      {siteSettings.phone && (
                        <a
                          href={`tel:${siteSettings.phone}`}
                          className="block text-slate-600 hover:text-violet-600 transition-colors duration-300 text-sm"
                        >
                          {siteSettings.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                  <p>{footerSettings.copyrightText}</p>
                  <p>Diseño sofisticado · Premium experience</p>
                </div>
              </motion.footer>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
