import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Central de Mensajería Unificada
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-purple-100">
              Gestiona todas tus conversaciones de WhatsApp Business, Messenger e Instagram
              desde una sola plataforma profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/messages" className="btn-primary">
                Acceder a Mensajes
              </Link>
              <a href="#features" className="btn-secondary">
                Conocer Más
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas para gestionar tu comunicación empresarial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="feature-card">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold mb-3">Centralización Total</h3>
              <p className="text-gray-600">
                Recibe y responde mensajes de WhatsApp Business, Facebook Messenger
                e Instagram Direct desde una única interfaz integrada.
              </p>
            </div>

            <div className="feature-card">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold mb-3">Tiempo Real</h3>
              <p className="text-gray-600">
                Actualizaciones instantáneas con tecnología serverless. Recibe notificaciones
                inmediatas cuando llegue un nuevo mensaje a cualquier canal.
              </p>
            </div>

            <div className="feature-card">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-3">Seguridad Avanzada</h3>
              <p className="text-gray-600">
                Verificación de firma de webhooks, encriptación de datos y
                cumplimiento con las mejores prácticas de seguridad de Meta.
              </p>
            </div>

            <div className="feature-card">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-3">Gestión Eficiente</h3>
              <p className="text-gray-600">
                Organiza conversaciones, gestiona contactos y accede al historial
                completo de mensajes con búsqueda avanzada.
              </p>
            </div>

            <div className="feature-card">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-2xl font-semibold mb-3">API Profesional</h3>
              <p className="text-gray-600">
                Integración directa con las APIs oficiales de Meta para WhatsApp,
                Messenger e Instagram con soporte completo.
              </p>
            </div>

            <div className="feature-card">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-semibold mb-3">Escalabilidad</h3>
              <p className="text-gray-600">
                Arquitectura serverless con Prisma y PostgreSQL, preparada para
                crecer con tu negocio sin comprometer el rendimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Canales Integrados
            </h2>
            <p className="text-xl text-gray-600">
              Conecta con tus clientes en sus plataformas preferidas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-green-600">WhatsApp Business</h3>
              <p className="text-gray-600">
                API oficial de Meta para comunicación empresarial en WhatsApp
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.13 3.259L19.752 8l-6.561 6.963z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">Facebook Messenger</h3>
              <p className="text-gray-600">
                Mensajería de Facebook integrada para tu página empresarial
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instagram Messaging</h3>
              <p className="text-gray-600">
                Mensajes directos de Instagram para una comunicación visual
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para centralizar tu comunicación?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Comienza a gestionar todos tus canales de mensajería desde una sola plataforma
          </p>
          <Link href="/messages" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg">
            Comenzar Ahora
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} JYP Turismo. Todos los derechos reservados.</p>
          <p className="text-sm">
            Desarrollado con Next.js 14 | Prisma | PostgreSQL | Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
