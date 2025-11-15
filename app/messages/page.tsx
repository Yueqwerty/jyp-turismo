'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Channel = 'ALL' | 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM';

interface Message {
  id: string;
  channel: 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM';
  senderName: string;
  preview: string;
  timestamp: Date;
  unread: boolean;
}

// Mock data - esto se reemplazará con datos reales de Prisma
const mockMessages: Message[] = [
  {
    id: '1',
    channel: 'WHATSAPP',
    senderName: 'María González',
    preview: 'Hola, quisiera información sobre el tour a Laguna San Rafael...',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: true,
  },
  {
    id: '2',
    channel: 'INSTAGRAM',
    senderName: 'Carlos Pérez',
    preview: '¿Tienen disponibilidad para el próximo fin de semana?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
  },
  {
    id: '3',
    channel: 'MESSENGER',
    senderName: 'Ana Martínez',
    preview: 'Muchas gracias por la información',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: false,
  },
];

const ChannelIcon = ({ channel }: { channel: 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM' }) => {
  switch (channel) {
    case 'WHATSAPP':
      return (
        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      );
    case 'MESSENGER':
      return (
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.13 3.259L19.752 8l-6.561 6.963z"/>
          </svg>
        </div>
      );
    case 'INSTAGRAM':
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        </div>
      );
  }
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  return date.toLocaleDateString('es-CL');
};

export default function MessagesPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const filteredMessages = selectedChannel === 'ALL'
    ? mockMessages
    : mockMessages.filter(m => m.channel === selectedChannel);

  const channels: { id: Channel; label: string }[] = [
    { id: 'ALL', label: 'Todos' },
    { id: 'WHATSAPP', label: 'WhatsApp' },
    { id: 'MESSENGER', label: 'Messenger' },
    { id: 'INSTAGRAM', label: 'Instagram' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center"
                >
                  <span className="text-xl font-black text-white">J&P</span>
                </motion.div>
                <span className="text-xl font-black text-gray-900 tracking-tighter">J&P Turismo</span>
              </Link>
              <div className="h-8 w-px bg-gray-200"></div>
              <h1 className="text-lg font-bold text-gray-600 tracking-tight">Centro de Mensajes</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">En línea</span>
              </div>
              <Link
                href="/api/auth/signout"
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-bold transition-all duration-300"
              >
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total</p>
                <p className="text-4xl font-black text-gray-900">{mockMessages.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400">Mensajes totales</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Sin leer</p>
                <p className="text-4xl font-black text-gray-900">{mockMessages.filter(m => m.unread).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400">Requieren atención</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Respuesta</p>
                <p className="text-4xl font-black text-gray-900">12m</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400">Tiempo promedio</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Satisfacción</p>
                <p className="text-4xl font-black text-gray-900">98%</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400">Calificación clientes</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar - Conversation List */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Channel Filters */}
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Conversaciones</h2>
                <div className="flex flex-wrap gap-3">
                  {channels.map((channel) => (
                    <motion.button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                        selectedChannel === channel.id
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {channel.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Messages List */}
              <div className="max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                    onClick={() => setSelectedMessage(message.id)}
                    className={`p-6 border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                      selectedMessage === message.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <ChannelIcon channel={message.channel} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-bold truncate ${message.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                            {message.senderName}
                          </h3>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2 font-medium">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm truncate mb-3 ${message.unread ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                          {message.preview}
                        </p>
                        <div className="flex items-center gap-2">
                          {message.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                            {message.channel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Message View */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm min-h-[700px] flex flex-col">
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <ChannelIcon channel={mockMessages.find(m => m.id === selectedMessage)!.channel} />
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                          {mockMessages.find(m => m.id === selectedMessage)!.senderName}
                        </h2>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          {mockMessages.find(m => m.id === selectedMessage)!.channel}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-3xl rounded-tl-md px-6 py-4 max-w-md shadow-sm border border-gray-200">
                        <p className="text-gray-900 mb-2">
                          {mockMessages.find(m => m.id === selectedMessage)!.preview}
                        </p>
                        <span className="text-xs text-gray-400 font-medium">
                          {formatTimestamp(mockMessages.find(m => m.id === selectedMessage)!.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Message Input */}
                  <div className="p-8 border-t border-gray-200 bg-white">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-all duration-300 font-medium"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                      >
                        Enviar
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Selecciona una conversación</h3>
                    <p className="text-gray-500 text-lg">
                      Elige un mensaje de la lista para comenzar
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
