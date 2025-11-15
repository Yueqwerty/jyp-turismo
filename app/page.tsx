'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useSpring as useSpringMotion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpringMotion(cursorX, springConfig);
  const cursorYSpring = useSpringMotion(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed w-8 h-8 border-2 border-blue-600 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-cyan-500 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: cursorX,
          top: cursorY,
          x: 13,
          y: 13,
        }}
      />
    </>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

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
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // 3D Tilt Effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-transform duration-200 ${className}`}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
      >
        {image && !imgError ? (
          <>
            <motion.div
              style={{ scale: imageScale }}
              className="w-full h-full"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </motion.div>

      {/* Glassmorphic overlay on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-700"></div>

      {/* Content */}
      <div className={`relative z-10 ${featured ? 'p-10 md:p-14' : 'p-8 md:p-10'} h-full flex flex-col justify-end`}>
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

export default function HomePage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cinematic parallax layers
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(heroScrollProgress, [0, 1], [0, -100]);
  const imageY = useTransform(heroScrollProgress, [0, 1], [0, 150]);
  const floatingY = useTransform(heroScrollProgress, [0, 1], [0, -250]);

  return (
    <div className="bg-white" ref={containerRef}>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 origin-left z-[100]"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation - Enhanced Glassmorphism */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="w-11 h-11 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span className="text-lg font-black text-white">J&P</span>
            </motion.div>
            <span className="text-lg font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">J&P Turismo</span>
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

      {/* Main Content */}
      <main>
        {/* Hero Section - Cinematic with Multilayer Parallax */}
        <section ref={heroRef} className="relative min-h-screen flex items-center px-8 md:px-16 py-48 md:py-56 overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white">

          {/* Floating gradient orbs - Background layer */}
          <motion.div
            style={{ y: floatingY, opacity: heroOpacity }}
            className="absolute top-20 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: floatingY, opacity: heroOpacity }}
            className="absolute bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-full blur-3xl"
          />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-[1600px] mx-auto w-full relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

              {/* Left: Typography - 7 columns */}
              <motion.div
                style={{ y: textY }}
                className="lg:col-span-7 space-y-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-3"
                  >
                    <div className="w-12 h-px bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                    Transporte · Patagonia Aysén
                  </motion.div>

                  <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-black text-gray-900 leading-[0.85] tracking-tighter mb-10 overflow-hidden">
                    <div className="block">
                      {"Explora".split("").map((letter, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 100, rotateX: 90 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="inline-block"
                          style={{ transformOrigin: 'center bottom' }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                    <div className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient">
                      {"Aysén".split("").map((letter, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 100, rotateX: 90, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.85 + i * 0.06,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotateZ: [-2, 2, -2, 0],
                            transition: { duration: 0.5 }
                          }}
                          className="inline-block"
                          style={{ transformOrigin: 'center bottom' }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </div>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light mb-10"
                  >
                    Transporte profesional a glaciares, capillas de mármol y la Carretera Austral.
                  </motion.p>

                  {/* Info Cards - Bento Style with Glassmorphism */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="grid grid-cols-2 gap-4 mb-10"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100/50 backdrop-blur-sm shadow-lg shadow-blue-100/20"
                    >
                      <div className="text-3xl font-black text-blue-600 mb-1">16 · 11</div>
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Pasajeros</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100/50 backdrop-blur-sm shadow-lg shadow-green-100/20"
                    >
                      <div className="text-sm font-black text-green-900 mb-1">Nov — Mar</div>
                      <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Temporada</div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* CTA Buttons - Magnetic Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-xl"
                >
                  <MagneticButton>
                    <motion.a
                      href="https://wa.me/56XXXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 py-5 bg-gray-900 text-white rounded-2xl font-bold overflow-hidden flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10">WhatsApp</span>
                      <svg className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-2 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.a>
                  </MagneticButton>

                  <MagneticButton>
                    <motion.a
                      href="tel:+56XXXXXXXXX"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-5 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:border-gray-900 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                    >
                      +56 9 XXXX XXXX
                    </motion.a>
                  </MagneticButton>
                </motion.div>
              </motion.div>

              {/* Right: Image - 5 columns with Parallax */}
              <motion.div
                style={{ y: imageY, scale: heroScale }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/tours/laguna-san-rafael.jpg"
                    alt="Glaciar San Rafael"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Glassmorphic badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="absolute bottom-8 right-8 px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <p className="text-white text-sm font-bold">Campo de Hielo Norte</p>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Stats Section - Cinematic Reveal */}
        <section className="relative py-32 md:py-40 px-8 md:px-16 bg-gray-900 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, cyan 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Floating Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"
          />

          <div className="max-w-[1600px] mx-auto relative z-10">

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8"
              />
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[0.9] tracking-tighter">
                Experiencia
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Comprobada
                </span>
              </h2>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: 500, suffix: '+', label: 'Clientes Satisfechos', delay: 0 },
                { value: 2, suffix: '', label: 'Buses Disponibles', delay: 0.2 },
                { value: 15, suffix: '+', label: 'Rutas Turísticas', delay: 0.4 },
                { value: 98, suffix: '%', label: 'Recomendación', delay: 0.6 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60, clipPath: 'circle(0% at 50% 50%)' }}
                  whileInView={{ opacity: 1, y: 0, clipPath: 'circle(100% at 50% 50%)' }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1, delay: stat.delay, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500"
                  >
                    <div className="text-[clamp(3rem,7vw,5rem)] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 mb-3 leading-none">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 mx-auto mb-4 group-hover:w-24 transition-all duration-500"></div>
                    <p className="text-white/70 text-sm md:text-base font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="mt-20 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent origin-left"
            />
          </div>
        </section>

        {/* Tours Section - Bento Grid with Reveal Transition */}
        <section className="relative py-40 md:py-52 px-8 md:px-16 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden" id="tours">

          {/* Decorative gradient orbs */}
          <div className="absolute top-40 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

          <div className="max-w-[1600px] mx-auto relative z-10">

            {/* Section Header with Stagger Animation */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mb-8 origin-left"
              />
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black text-gray-900 leading-[0.85] tracking-tighter mb-8">
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block"
                >
                  Rutas
                </motion.span>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light"
              >
                Destinos icónicos de la Patagonia de Aysén.
              </motion.p>
            </motion.div>

            {/* Bento Grid - Asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              <TourCard
                title="Laguna San Rafael"
                description="Glaciar San Rafael y Campo de Hielo Norte"
                tags={["Día completo", "Navegación"]}
                image="/images/tours/laguna-san-rafael.jpg"
                gradient="from-blue-600 to-cyan-600"
                className="md:col-span-7 md:row-span-2 min-h-[600px]"
                featured
              />

              <TourCard
                title="Capillas de Mármol"
                tags={["Fotografía"]}
                image="/images/tours/capillas-marmol.jpg"
                gradient="from-cyan-500 to-blue-600"
                className="md:col-span-5 min-h-[290px]"
              />

              <TourCard
                title="Parque Queulat"
                tags={["Medio día"]}
                image="/images/tours/queulat.jpg"
                gradient="from-emerald-600 to-green-700"
                className="md:col-span-5 min-h-[290px]"
              />

              <TourCard
                title="Ensenada Pérez"
                tags={["Fiordos"]}
                image="/images/tours/ensenada-perez.jpg"
                gradient="from-slate-700 to-slate-900"
                className="md:col-span-5 min-h-[360px]"
              />

              <TourCard
                title="Carretera Austral"
                tags={["Multi-día"]}
                image="/images/tours/carretera-austral.jpg"
                gradient="from-green-600 to-teal-700"
                className="md:col-span-7 min-h-[360px]"
              />

              <TourCard
                title="Ventisqueros"
                tags={["Trekking"]}
                image="/images/tours/ventisqueros.jpg"
                gradient="from-cyan-600 to-blue-800"
                className="md:col-span-4 min-h-[320px]"
              />

              <TourCard
                title="Pesca Deportiva"
                tags={["Medio día"]}
                image="/images/tours/pesca-deportiva.jpg"
                gradient="from-orange-600 to-red-600"
                className="md:col-span-8 min-h-[320px]"
              />
            </div>
          </div>
        </section>

        {/* Footer - Cinematic */}
        <footer className="relative py-32 md:py-40 px-8 md:px-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-[1600px] mx-auto relative z-10">

            <div className="grid md:grid-cols-2 gap-20 lg:gap-32 mb-28">
              {/* Left: Brand */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-md"
              >
                <div className="text-[clamp(3rem,6vw,5rem)] font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter">
                  J&P<br />Turismo
                </div>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mb-8 origin-left"
                />
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light mb-8">
                  Transporte turístico profesional en la Región de Aysén, Chile.
                </p>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-3"
                >
                  <a href="mailto:contacto@jypturismo.cl" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 group">
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">contacto@jypturismo.cl</span>
                  </a>
                  <a href="tel:+56XXXXXXXXX" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 group">
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">+56 9 XXXX XXXX</span>
                  </a>
                </motion.div>
              </motion.div>

              {/* Right: Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col justify-end items-start md:items-end gap-8"
              >
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Síguenos</p>
                  <div className="flex gap-4">
                    {[
                      { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                      { name: 'Instagram', path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' }
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 hover:from-blue-600 hover:to-cyan-600 text-gray-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                      >
                        <svg className="w-6 h-6 transition-transform group-hover:scale-110 duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d={social.path} />
                        </svg>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="w-full max-w-md"
                >
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Newsletter</p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="flex-1 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors duration-300 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all duration-300"
                    >
                      →
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-10 border-t border-gray-200/80"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">
                  &copy; {new Date().getFullYear()} J&P Turismo · Región de Aysén, Chile
                </p>
                <div className="flex gap-6 text-xs text-gray-500">
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">Términos</a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">Privacidad</a>
                  <a href="#" className="hover:text-gray-900 transition-colors duration-300">Cookies</a>
                </div>
              </div>
            </motion.div>

          </div>
        </footer>
      </main>
    </div>
  );
}
