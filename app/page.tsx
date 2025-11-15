'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HomePage() {
  const [videoError, setVideoError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section con Video/Imagen de fondo */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video o Imagen */}
        <div className="absolute inset-0 z-0">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-40"
              onError={() => setVideoError(true)}
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 opacity-60"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Logo placeholder - reemplazar con logo real */}
            <div className="w-32 h-32 mx-auto mb-6 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
              <span className="text-6xl font-bold text-white">JYP</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Descubre la Patagonia de Aysén
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Vive experiencias inolvidables en la región más prístina de Chile.
            Glaciares, lagos, montañas y la majestuosa Carretera Austral te esperan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#tours"
              className="bg-white text-blue-900 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Explorar Tours
            </a>
            <a
              href="#contacto"
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Contáctanos
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Sobre Nosotros */}
      <section className="py-20 px-6 bg-white" id="nosotros">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sobre JYP Turismo
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Somos una empresa especializada en turismo de aventura y naturaleza en la región de Aysén.
              Con años de experiencia, te guiamos por los rincones más espectaculares de la Patagonia chilena,
              garantizando seguridad, profesionalismo y experiencias auténticas.
            </p>
          </motion.div>

          {/* Placeholder para imagen de presentación */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-lg opacity-50">
                Coloca tu imagen de presentación en /public/images/presentacion.jpg
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinos y Tours - Estilo Bento */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50" id="tours">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestros Tours
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora los destinos más icónicos de Aysén con guías expertos
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(250px,auto)]"
          >
            {/* Cuevas de Mármol - Grande */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Cuevas de Mármol
                  </h3>
                  <p className="text-lg text-blue-100 mb-6 max-w-lg">
                    Navega por las impresionantes formaciones de mármol en el Lago General Carrera.
                    Una maravilla natural única en el mundo que cambia de color según la estación.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Navegación
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Fotografía
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Medio día
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Carretera Austral */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carretera Austral</h3>
              <p className="text-gray-600 text-sm">
                Recorre la ruta escénica más famosa de Chile. Paisajes de montaña, bosques y ríos cristalinos.
              </p>
            </motion.div>

            {/* Glaciar Exploradores */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Glaciar Exploradores</h3>
              <p className="text-gray-600 text-sm">
                Trekking sobre hielo milenario. Una experiencia única de contacto con la naturaleza glaciar.
              </p>
            </motion.div>

            {/* Pesca Deportiva */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pesca Deportiva</h3>
                <p className="text-blue-100 text-sm">
                  Ríos y lagos repletos de truchas y salmones. Ideal para pescadores de todos los niveles.
                </p>
              </div>
            </motion.div>

            {/* Laguna San Rafael */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-3 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 group cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Laguna San Rafael</h3>
                  <p className="text-gray-600 mb-4">
                    Navegación hasta el Glaciar San Rafael, parte del Campo de Hielo Norte.
                    Observa témpanos de hielo azul flotando en aguas cristalinas.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Día completo
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Navegación
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trekking */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Trekking y Montañismo</h3>
                <p className="text-orange-100 mb-6">
                  Rutas para todos los niveles. Desde caminatas suaves hasta ascensos desafiantes
                  en la Cordillera de los Andes patagónicos.
                </p>
                <div className="flex gap-3">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Aventura
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Naturaleza
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Galería de Imágenes */}
      <section className="py-20 px-6 bg-white" id="galeria">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Galería
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">
              Momentos capturados en la Patagonia de Aysén
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl overflow-hidden relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <p className="text-white text-sm opacity-50">
                    galeria-{i}.jpg
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Coloca tus imágenes en /public/images/galeria-1.jpg a galeria-8.jpg
            </p>
          </div>
        </div>
      </section>

      {/* Contacto y CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900" id="contacto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comienza tu Aventura
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Contáctanos para diseñar tu experiencia perfecta en Aysén.
              Estamos listos para hacer realidad tu viaje soñado.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <svg className="w-8 h-8 text-blue-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h4 className="text-white font-semibold mb-2">Teléfono</h4>
                <p className="text-blue-200 text-sm">+56 9 XXXX XXXX</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <svg className="w-8 h-8 text-blue-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h4 className="text-white font-semibold mb-2">Email</h4>
                <p className="text-blue-200 text-sm">contacto@jypturismo.cl</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <svg className="w-8 h-8 text-blue-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 className="text-white font-semibold mb-2">Ubicación</h4>
                <p className="text-blue-200 text-sm">Aysén, Chile</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/56XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:contacto@jypturismo.cl"
                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Enviar Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">JYP Turismo</h3>
              <p className="text-gray-400 text-sm">
                Tu guía experto para descubrir la magia de la Patagonia de Aysén.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#nosotros" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#tours" className="hover:text-white transition-colors">Nuestros Tours</a></li>
                <li><a href="#galeria" className="hover:text-white transition-colors">Galería</a></li>
                <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} JYP Turismo - Región de Aysén, Chile. Todos los derechos reservados.</p>
            <p className="mt-2">
              <Link href="/login" className="text-gray-500 hover:text-gray-400 transition-colors text-xs">
                Acceso operadores
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
