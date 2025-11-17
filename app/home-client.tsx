'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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

const FeaturedTour = ({ tour, index }: { tour: Tour; index: number }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    >
      <div className="relative w-full h-full">
        {tour.image && !imgError ? (
          <>
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              quality={90}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}

        <div className="absolute inset-0 flex items-end p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {tour.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white text-sm font-semibold border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-6"
            >
              {tour.title}
            </motion.h2>

            {tour.description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl font-light"
              >
                {tour.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TourGrid = ({ tours }: { tours: Tour[] }) => {
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (tourId: string) => {
    setImgErrors(prev => ({ ...prev, [tourId]: true }));
  };

  return (
    <div className="grid grid-cols-12 gap-4 auto-rows-[240px]">
      {tours.map((tour) => {
        const spanClass = `col-span-12 md:col-span-${tour.colSpan >= 7 ? '7' : tour.colSpan >= 5 ? '5' : '4'}`;
        const rowSpanClass = tour.rowSpan === 2 ? 'md:row-span-2' : '';

        return (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`${spanClass} ${rowSpanClass} group relative overflow-hidden rounded-3xl cursor-pointer`}
          >
            <div className="absolute inset-0">
              {tour.image && !imgErrors[tour.id] ? (
                <>
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(tour.id)}
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
              )}
            </div>

            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500" />

            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
              <motion.h3
                className="font-black text-white leading-tight tracking-tighter text-2xl md:text-4xl mb-3 group-hover:translate-x-2 transition-transform duration-300"
              >
                {tour.title}
              </motion.h3>

              {tour.tags && tour.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tour.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function HomeClient({
  heroSection,
  toursSection,
  tours,
  footerSettings,
  siteSettings,
}: HomeClientProps) {
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'featured' | 'grid'>('featured');
  const heroRef = useRef(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);

  const featuredTours = tours.filter(t => t.featured);
  const nonFeaturedTours = tours.filter(t => !t.featured);

  useEffect(() => {
    if (viewMode === 'featured' && featuredTours.length > 0) {
      const interval = setInterval(() => {
        setCurrentTourIndex((prev) => (prev + 1) % featuredTours.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [viewMode, featuredTours.length]);

  const nextTour = () => {
    setCurrentTourIndex((prev) => (prev + 1) % featuredTours.length);
  };

  const prevTour = () => {
    setCurrentTourIndex((prev) => (prev - 1 + featuredTours.length) % featuredTours.length);
  };

  return (
    <div className="bg-black">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl group-hover:bg-blue-600 transition-colors duration-300">
              <span className="text-base font-black text-black group-hover:text-white transition-colors duration-300">
                {siteSettings.logoText}
              </span>
            </div>
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
                className="px-6 py-2.5 text-sm text-black font-bold bg-white hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300"
              >
                Contactar
              </motion.a>
            )}

            <Link
              href="/login"
              className="px-5 py-2.5 text-sm text-white/70 hover:text-white font-medium hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 text-center px-6 md:px-12 max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-white/60 uppercase tracking-[0.3em] font-bold mb-8"
            >
              {heroSection.tagline}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[clamp(3rem,12vw,11rem)] font-black text-white leading-[0.85] tracking-tighter mb-8"
            >
              <span className="block">{heroSection.titleLine1}</span>
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {heroSection.titleLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto font-light mb-12"
            >
              {heroSection.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              {siteSettings.whatsappNumber && (
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-10 py-5 bg-white hover:bg-blue-600 text-black hover:text-white rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl transition-all duration-300"
                >
                  <span>{heroSection.ctaWhatsappText}</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}

              {siteSettings.phone && (
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  {heroSection.ctaPhoneText}
                </a>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">
                  {heroSection.infoCard1Title}
                </div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  {heroSection.infoCard1Subtitle}
                </div>
              </div>

              <div className="w-px h-12 bg-white/20" />

              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">
                  {heroSection.infoCard2Title}
                </div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  {heroSection.infoCard2Subtitle}
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium flex flex-col items-center gap-3"
          >
            <span className="uppercase tracking-wider text-xs">Scroll para explorar</span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        </section>

        {/* Tours Section */}
        <section className="relative bg-white py-24 md:py-32">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter mb-4"
                >
                  {toursSection.sectionTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-xl text-gray-600 leading-relaxed max-w-2xl font-light"
                >
                  {toursSection.sectionDescription}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1.5"
              >
                <button
                  onClick={() => setViewMode('featured')}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    viewMode === 'featured'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Destacados
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Todos
                </button>
              </motion.div>
            </div>

            {viewMode === 'featured' && featuredTours.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <FeaturedTour key={currentTourIndex} tour={featuredTours[currentTourIndex]} index={currentTourIndex} />
                </AnimatePresence>

                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-20">
                  <div className="flex gap-2">
                    {featuredTours.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTourIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentTourIndex
                            ? 'bg-white w-12'
                            : 'bg-white/40 w-8 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevTour}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextTour}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <TourGrid tours={nonFeaturedTours.length > 0 ? nonFeaturedTours : tours} />
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 md:py-24">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="lg:col-span-2">
                <h3 className="text-4xl font-black mb-4 leading-tight whitespace-pre-line">
                  {footerSettings.brandTitle}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed max-w-md font-light">
                  {footerSettings.brandDescription}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Contacto</h4>
                <div className="space-y-3">
                  {siteSettings.email && (
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="block text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {siteSettings.email}
                    </a>
                  )}
                  {siteSettings.phone && (
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="block text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {siteSettings.phone}
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-4">Redes Sociales</h4>
                <div className="flex gap-3">
                  {siteSettings.instagramUrl && (
                    <a
                      href={siteSettings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="sr-only">Instagram</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {siteSettings.facebookUrl && (
                    <a
                      href={siteSettings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
              <p>{footerSettings.copyrightText}</p>
              <p>Diseño cinematográfico · Awwwards style</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
