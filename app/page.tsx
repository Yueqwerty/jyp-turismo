'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';

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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {image && !imgError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      {/* Content */}
      <div className={`relative z-10 ${featured ? 'p-10 md:p-14' : 'p-8 md:p-10'} h-full flex flex-col justify-end`}>
        <h3 className={`font-black text-white leading-[0.9] tracking-tighter transition-transform duration-500 group-hover:translate-y-[-4px] ${featured ? 'text-4xl md:text-6xl mb-5' : 'text-2xl md:text-4xl mb-3'}`}>
          {title}
        </h3>
        {featured && description && (
          <p className="text-white/95 text-lg md:text-xl leading-relaxed max-w-xl mb-6 font-light">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothProgress, [0, 0.3], [0, 100]);

  return (
    <div className="bg-white" ref={containerRef}>
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 origin-left z-[100]"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 py-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gray-900 rounded-2xl flex items-center justify-center">
              <span className="text-lg font-black text-white">J&P</span>
            </div>
            <span className="text-lg font-black text-gray-900 tracking-tight">J&P Turismo</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Admin
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Editorial with Bento */}
        <section className="relative min-h-screen flex items-center px-8 md:px-16 py-48 md:py-56 overflow-hidden bg-white">
          <motion.div
            style={{ y: heroY }}
            className="max-w-[1600px] mx-auto w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

              {/* Left: Typography - 7 columns */}
              <div className="lg:col-span-7 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold mb-8">
                    Transporte · Patagonia Aysén
                  </div>

                  <h1 className="text-[clamp(3.5rem,9vw,8rem)] font-black text-gray-900 leading-[0.88] tracking-tighter mb-10">
                    Explora<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                      Aysén
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light mb-10">
                    Transporte profesional a glaciares, capillas de mármol y la Carretera Austral.
                  </p>

                  {/* Info Cards - Bento Style */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                      <div className="text-3xl font-black text-blue-600 mb-1">16 · 11</div>
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Pasajeros</div>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <div className="text-sm font-black text-green-900 mb-1">Nov — Mar</div>
                      <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Temporada</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-xl"
                >
                  <motion.a
                    href="https://wa.me/56XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-5 bg-gray-900 text-white rounded-2xl font-bold transition-all duration-300 hover:bg-gray-800 flex items-center justify-center gap-3"
                  >
                    <span>WhatsApp</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>

                  <motion.a
                    href="tel:+56XXXXXXXXX"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-5 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 text-center"
                  >
                    +56 9 XXXX XXXX
                  </motion.a>
                </motion.div>
              </div>

              {/* Right: Image - 5 columns */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative h-[500px] md:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/tours/laguna-san-rafael.jpg"
                    alt="Glaciar San Rafael"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Tours Section - Bento Grid */}
        <section className="py-40 md:py-52 px-8 md:px-16 bg-gray-50" id="tours">
          <div className="max-w-[1600px] mx-auto">

            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-24 max-w-3xl"
            >
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black text-gray-900 leading-[0.88] tracking-tighter mb-8">
                Rutas
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                Destinos icónicos de la Patagonia de Aysén.
              </p>
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

        {/* Footer */}
        <footer className="py-28 md:py-36 px-8 md:px-16 bg-white border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid md:grid-cols-2 gap-20 mb-24">
              <div className="max-w-md">
                <div className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">
                  J&P<br />Turismo
                </div>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  Transporte turístico en Aysén, Chile.
                </p>
              </div>

              <div className="flex items-end justify-end gap-5">
                {['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'].map((path, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.08 }}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-900 text-gray-600 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-10">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} J&P Turismo · Región de Aysén, Chile
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
