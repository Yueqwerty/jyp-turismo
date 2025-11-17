'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface HeroSection {
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  infoCard1Title: string;
  infoCard1Subtitle: string;
  infoCard2Title: string;
  infoCard2Subtitle: string;
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
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = (cardRef.current as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Determinar tamaño basado en colSpan y rowSpan
  const getCardSize = () => {
    if (tour.featured || tour.colSpan >= 7) {
      return 'col-span-2 row-span-2 h-[600px]';
    } else if (tour.colSpan >= 5) {
      return 'col-span-1 row-span-2 h-[600px]';
    } else {
      return 'col-span-1 row-span-1 h-[280px]';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`${getCardSize()} group relative overflow-hidden rounded-[2rem] cursor-pointer perspective-1000`}
    >
      <div className="absolute inset-0 z-0">
        {tour.image && !imgError ? (
          <>
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover transition-all duration-[800ms] ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
              quality={90}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {tour.tags.slice(0, 3).map((tag, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-3 py-1.5 bg-white/15 backdrop-blur-xl rounded-full text-white text-xs font-bold border border-white/20 transition-all duration-300"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.3 }}
          className={`font-black text-white leading-[0.95] tracking-tighter mb-3 transition-transform duration-300 group-hover:translate-x-2 ${
            tour.featured || tour.colSpan >= 7 ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'
          }`}
        >
          {tour.title}
        </motion.h3>

        {/* Description (only for large cards) */}
        {tour.description && (tour.featured || tour.colSpan >= 7) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-white/90 text-base md:text-lg leading-relaxed max-w-lg font-light line-clamp-2 group-hover:line-clamp-none transition-all duration-300"
          >
            {tour.description}
          </motion.p>
        )}

        {/* Arrow icon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ x: 5, opacity: 1 }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Border gradient on hover */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
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
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={containerRef} className="bg-black min-h-screen">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="px-8 md:px-12 lg:px-16 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20"
            >
              <span className="text-lg font-black text-white">{siteSettings.logoText}</span>
            </motion.div>
            <span className="text-base font-black text-white tracking-tight">
              {siteSettings.companyName}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {siteSettings.whatsappNumber && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${siteSettings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex px-6 py-2.5 text-sm font-bold bg-white text-black hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-lg shadow-white/10"
              >
                Contactar
              </motion.a>
            )}

            <Link
              href="/login"
              className="px-5 py-2.5 text-sm text-white/60 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="relative">
        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* LEFT PANEL - FIXED HERO/BRANDING */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[45%] bg-black flex items-center justify-center p-8 md:p-12 lg:p-16 border-r border-white/5"
          >
            <div className="max-w-xl w-full space-y-10">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-px bg-gradient-to-r from-blue-500 to-transparent" />
                <span className="text-xs text-white/50 uppercase tracking-[0.3em] font-bold">
                  {heroSection.tagline}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-[clamp(3rem,8vw,7rem)] font-black text-white leading-[0.9] tracking-tighter mb-6">
                  <span className="block">{heroSection.titleLine1}</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                    {heroSection.titleLine2}
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-white/70 leading-relaxed font-light"
              >
                {heroSection.description}
              </motion.p>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 backdrop-blur-xl"
                >
                  <div className="text-3xl font-black text-blue-400 mb-1">
                    {heroSection.infoCard1Title}
                  </div>
                  <div className="text-xs font-bold text-blue-300/70 uppercase tracking-wider">
                    {heroSection.infoCard1Subtitle}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-xl"
                >
                  <div className="text-3xl font-black text-white mb-1">
                    {heroSection.infoCard2Title}
                  </div>
                  <div className="text-xs font-bold text-white/50 uppercase tracking-wider">
                    {heroSection.infoCard2Subtitle}
                  </div>
                </motion.div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                {siteSettings.whatsappNumber && (
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/${siteSettings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-1 px-8 py-4 bg-white hover:bg-blue-600 text-black hover:text-white rounded-2xl font-bold text-center flex items-center justify-center gap-3 shadow-2xl shadow-white/10 transition-all duration-300"
                  >
                    <span>{heroSection.ctaWhatsappText}</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                )}

                {siteSettings.phone && (
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${siteSettings.phone}`}
                    className="flex-1 px-8 py-4 bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl font-bold text-center hover:bg-white/10 transition-all duration-300"
                  >
                    {heroSection.ctaPhoneText}
                  </motion.a>
                )}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center gap-3 pt-8 border-t border-white/5"
              >
                <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Síguenos</span>
                <div className="flex gap-2">
                  {siteSettings.instagramUrl && (
                    <motion.a
                      whileHover={{ y: -3, scale: 1.1 }}
                      href={siteSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </motion.a>
                  )}
                  {siteSettings.facebookUrl && (
                    <motion.a
                      whileHover={{ y: -3, scale: 1.1 }}
                      href={siteSettings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT PANEL - SCROLLABLE TOURS */}
          <div className="lg:ml-[45%] lg:w-[55%] w-full">
            <motion.div
              ref={toursContainerRef}
              style={{ y: backgroundY, opacity }}
              className="min-h-screen p-8 md:p-12 lg:p-16"
            >
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
              >
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-6">
                  {toursSection.sectionTitle}
                </h2>
                <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-light">
                  {toursSection.sectionDescription}
                </p>
              </motion.div>

              {/* Bento Grid of Tours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
                {tours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} />
                ))}
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-32 pt-16 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                  <div className="md:col-span-2">
                    <h3 className="text-3xl font-black text-white mb-4 leading-tight whitespace-pre-line">
                      {footerSettings.brandTitle}
                    </h3>
                    <p className="text-white/50 text-base leading-relaxed font-light max-w-md">
                      {footerSettings.brandDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/30 mb-4">
                      Contacto
                    </h4>
                    <div className="space-y-2">
                      {siteSettings.email && (
                        <a
                          href={`mailto:${siteSettings.email}`}
                          className="block text-white/60 hover:text-white transition-colors duration-300 text-sm"
                        >
                          {siteSettings.email}
                        </a>
                      )}
                      {siteSettings.phone && (
                        <a
                          href={`tel:${siteSettings.phone}`}
                          className="block text-white/60 hover:text-white transition-colors duration-300 text-sm"
                        >
                          {siteSettings.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
                  <p>{footerSettings.copyrightText}</p>
                  <p>Diseño innovador · Awwwards inspired</p>
                </div>
              </motion.footer>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
