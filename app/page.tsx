'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';

const RouteCard = ({
  title,
  destination,
  duration,
  image,
  className = ""
}: {
  title: string;
  destination: string;
  duration: string;
  image?: string;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {image && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {destination}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{duration}</span>
        </div>
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

  return (
    <div className="bg-white" ref={containerRef}>
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gray-900 origin-left z-[100]"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center">
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
        {/* Hero Section - Service Focus */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: Service Information */}
              <div className="space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                    Transporte Turístico
                  </div>

                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight mb-6">
                    Llega seguro a los destinos más icónicos de Aysén
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed mb-8">
                    Servicio de transporte profesional a glaciares, capillas de mármol y la Carretera Austral desde Puerto Aysén.
                  </p>

                  {/* Características del Servicio */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Capacidad</p>
                        <p className="text-xs text-gray-600">16 y 11 pasajeros</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Temporada</p>
                        <p className="text-xs text-gray-600">Nov — Marzo</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="https://wa.me/56XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-8 py-4 bg-gray-900 text-white rounded-xl font-bold transition-all duration-300 hover:bg-gray-800 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Consultar Disponibilidad</span>
                  </a>
                  <a
                    href="tel:+56XXXXXXXXX"
                    className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 text-center"
                  >
                    +56 9 XXXX XXXX
                  </a>
                </motion.div>
              </div>

              {/* Right: Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
              >
                <Image
                  src="/images/tours/laguna-san-rafael.jpg"
                  alt="Servicio de Transporte J&P"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Routes Section */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-white" id="tours">
          <div className="max-w-7xl mx-auto">

            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Nuestras Rutas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Servicio de transporte a los principales destinos turísticos de la región de Aysén.
              </p>
            </motion.div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RouteCard
                title="Laguna San Rafael"
                destination="Glaciar San Rafael · Campo de Hielo Norte"
                duration="Día completo"
                image="/images/tours/laguna-san-rafael.jpg"
              />

              <RouteCard
                title="Capillas de Mármol"
                destination="Puerto Tranquilo · Lago General Carrera"
                duration="Día completo"
                image="/images/tours/capillas-marmol.jpg"
              />

              <RouteCard
                title="Parque Queulat"
                destination="Ventisquero Colgante"
                duration="Medio día"
                image="/images/tours/queulat.jpg"
              />

              <RouteCard
                title="Ensenada Pérez"
                destination="Fiordos patagónicos"
                duration="Día completo"
                image="/images/tours/ensenada-perez.jpg"
              />

              <RouteCard
                title="Carretera Austral"
                destination="Ruta escénica completa"
                duration="Multi-día"
                image="/images/tours/carretera-austral.jpg"
              />

              <RouteCard
                title="Tours Personalizados"
                destination="Consultar destinos disponibles"
                duration="Variable"
                image="/images/tours/pesca-deportiva.jpg"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 md:py-20 px-6 md:px-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-black text-white">J&P</span>
                  </div>
                  <span className="text-xl font-black text-gray-900">J&P Turismo</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Transporte turístico profesional en la región de Aysén, Chile.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Contacto</h3>
                <div className="space-y-2 text-gray-600">
                  <p>+56 9 XXXX XXXX</p>
                  <p>contacto@jypturismo.cl</p>
                  <p>Puerto Aysén, Chile</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Síguenos</h3>
                <div className="flex gap-3">
                  {['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'].map((path, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-900 hover:text-white text-gray-600 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8">
              <p className="text-sm text-gray-500 text-center">
                &copy; {new Date().getFullYear()} J&P Turismo · Región de Aysén, Chile
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
