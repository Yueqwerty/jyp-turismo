'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';

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
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

interface HomeClientProps {
  heroSection: HeroSection;
  toursSection: ToursSection;
  tours: Tour[];
  footerSettings: FooterSettings;
  siteSettings: SiteSettings;
}

const TourCard = ({
  title,
  description,
  tags,
  image,
  gradient,
  className = '',
  featured = false,
}: {
  title: string;
  description?: string | null;
  tags?: string[];
  image?: string;
  gradient: string;
  className?: string;
  featured?: boolean;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 ${className}`}
    >
      <div className="absolute inset-0">
        {image && !imgError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
              quality={80}
              sizes={
                featured
                  ? '(max-width: 768px) 100vw, 58vw'
                  : '(max-width: 768px) 100vw, 42vw'
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-700"></div>

      <div
        className={`relative z-10 ${featured ? 'p-10 md:p-14' : 'p-8 md:p-10'} h-full flex flex-col justify-end`}
      >
        <motion.h3
          className={`font-black text-white leading-[0.88] tracking-tighter ${featured ? 'text-4xl md:text-6xl mb-5' : 'text-2xl md:text-4xl mb-3'}`}
          whileHover={{ x: 4, transition: { duration: 0.3 } }}
        >
          {title}
        </motion.h3>
        {featured && description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-white/95 text-lg md:text-xl leading-relaxed max-w-xl mb-6 font-light"
          >
            {description}
          </motion.p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
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
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5, 1], [1, 0.9, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -80]);
  const imageY = useTransform(heroScrollProgress, [0, 1], [0, 100]);

  return (
    <div className="bg-white" ref={containerRef}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-blue-600 origin-left z-[100]"
        style={{ scaleX: smoothProgress }}
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors duration-300">
              <span className="text-lg font-black text-white">{siteSettings.logoText}</span>
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
              {siteSettings.companyName}
            </span>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm text-gray-700 hover:text-gray-900 font-medium bg-gray-100/80 hover:bg-gray-200/80 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              Admin
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center px-8 md:px-16 py-48 md:py-56 overflow-hidden bg-white"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-[1600px] mx-auto w-full relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              <motion.div style={{ y: textY }} className="lg:col-span-6 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xs text-gray-500 uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-3"
                  >
                    <div className="w-12 h-px bg-blue-600"></div>
                    {heroSection.tagline}
                  </motion.div>

                  <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black text-gray-900 leading-[0.85] tracking-tighter mb-10">
                    <motion.span
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="block"
                    >
                      {heroSection.titleLine1}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="block text-blue-600"
                    >
                      {heroSection.titleLine2}
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light mb-10"
                  >
                    {heroSection.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="grid grid-cols-2 gap-4 mb-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-blue-50 rounded-2xl border border-blue-100 backdrop-blur-sm shadow-lg h-[110px] flex flex-col justify-center"
                    >
                      <div className="text-2xl font-black text-blue-600 mb-1">
                        {heroSection.infoCard1Title}
                      </div>
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                        {heroSection.infoCard1Subtitle}
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-gray-50 rounded-2xl border border-gray-200 backdrop-blur-sm shadow-lg h-[110px] flex flex-col justify-center"
                    >
                      <div className="text-2xl font-black text-gray-900 mb-1">
                        {heroSection.infoCard2Title}
                      </div>
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {heroSection.infoCard2Subtitle}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-xl"
                >
                  {siteSettings.whatsappNumber && (
                    <a
                      href={`https://wa.me/${siteSettings.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group relative px-8 py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <span>{heroSection.ctaWhatsappText}</span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  )}

                  {siteSettings.phone && (
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="flex-1 px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:border-gray-900 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      {heroSection.ctaPhoneText}
                    </a>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                style={{ y: imageY, scale: heroScale }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6"
              >
                <div className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={heroSection.heroImage}
                    alt={heroSection.heroImageAlt}
                    fill
                    className="object-cover"
                    priority
                    fetchPriority="high"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="absolute bottom-8 right-8 px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <p className="text-white text-sm font-bold">{heroSection.heroBadgeText}</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Tours Section */}
        <section
          className="relative py-40 md:py-52 px-8 md:px-16 bg-gray-50 overflow-hidden"
          id="tours"
        >
          <div className="max-w-[1600px] mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-16 h-1 bg-blue-600 mb-8 origin-left"
              />
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black text-gray-900 leading-[0.85] tracking-tighter mb-8">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="block"
                >
                  {toursSection.sectionTitle}
                </motion.span>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light"
              >
                {toursSection.sectionDescription}
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  title={tour.title}
                  description={tour.description}
                  tags={tour.tags}
                  image={tour.image}
                  gradient={tour.gradient}
                  className={`md:col-span-${tour.colSpan} ${tour.rowSpan > 1 ? `md:row-span-${tour.rowSpan}` : ''} min-h-[${tour.minHeight}]`}
                  featured={tour.featured}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-32 md:py-40 px-8 md:px-16 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>

          <div className="max-w-[1600px] mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-20 lg:gap-32 mb-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
              >
                <div className="text-[clamp(3rem,6vw,5rem)] font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter whitespace-pre-line">
                  {footerSettings.brandTitle}
                </div>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-20 h-1 bg-blue-600 mb-8 origin-left"
                />
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-8">
                  {footerSettings.brandDescription}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-3"
                >
                  {siteSettings.email && (
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{siteSettings.email}</span>
                    </a>
                  )}
                  {siteSettings.phone && (
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{siteSettings.phone}</span>
                    </a>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col justify-end items-start md:items-end gap-8"
              >
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                    Síguenos
                  </p>
                  <div className="flex gap-4">
                    {siteSettings.facebookUrl && (
                      <motion.a
                        href={siteSettings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-14 h-14 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                      >
                        <svg
                          className="w-6 h-6 transition-transform group-hover:scale-110 duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </motion.a>
                    )}
                    {siteSettings.instagramUrl && (
                      <motion.a
                        href={siteSettings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-14 h-14 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                      >
                        <svg
                          className="w-6 h-6 transition-transform group-hover:scale-110 duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                      </motion.a>
                    )}
                  </div>
                </div>

                {footerSettings.newsletterEnabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                  >
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                      {footerSettings.newsletterTitle}
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        placeholder={footerSettings.newsletterPlaceholder}
                        aria-label="Email para newsletter"
                        className="flex-1 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300 text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Suscribirse al newsletter"
                        className="px-6 py-3 bg-gray-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all duration-300"
                      >
                        →
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-10 border-t border-gray-200/80"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  © {new Date().getFullYear()} {footerSettings.copyrightText}
                </p>
                <div className="flex gap-6 text-xs text-gray-500">
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                    Términos
                  </a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                    Privacidad
                  </a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">
                    Cookies
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </main>
    </div>
  );
}
