import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getMessages() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        conversation: {
          include: {
            contact: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 100,
    });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export default async function MessagesPage() {
  const messages = await getMessages();

  const getChannelBadgeClass = (channel: string) => {
    switch (channel) {
      case 'WHATSAPP':
        return 'channel-badge channel-whatsapp';
      case 'MESSENGER':
        return 'channel-badge channel-messenger';
      case 'INSTAGRAM':
        return 'channel-badge channel-instagram';
      default:
        return 'channel-badge bg-gray-500';
    }
  };

  const getDirectionClass = (direction: string) => {
    return direction === 'INBOUND'
      ? 'border-l-4 border-l-blue-500'
      : 'border-l-4 border-l-green-500 bg-green-50';
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      SENT: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      READ: 'bg-purple-100 text-purple-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central de Mensajes</h1>
              <p className="text-gray-600 mt-1">Todos los mensajes de WhatsApp, Messenger e Instagram</p>
            </div>
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="channel" className="text-sm font-medium text-gray-700">
              Canal:
            </label>
            <select
              id="channel"
              className="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Todos los canales</option>
              <option value="WHATSAPP">WhatsApp Business</option>
              <option value="MESSENGER">Messenger</option>
              <option value="INSTAGRAM">Instagram</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="direction" className="text-sm font-medium text-gray-700">
              Dirección:
            </label>
            <select
              id="direction"
              className="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="">Todas</option>
              <option value="INBOUND">Entrantes</option>
              <option value="OUTBOUND">Salientes</option>
            </select>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No hay mensajes</h3>
            <p className="text-gray-500">
              Los mensajes aparecerán aquí cuando lleguen desde los canales configurados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-card ${getDirectionClass(message.direction)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={getChannelBadgeClass(message.channel)}>
                      {message.channel.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(message.sentAt).toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(message.status)}`}>
                    {message.status}
                  </span>
                </div>

                <div className="mb-2">
                  <strong className="text-gray-900">
                    {message.direction === 'INBOUND' ? message.senderName : message.recipientName}
                  </strong>
                  <span className="text-gray-500 text-sm ml-2">
                    ({message.direction === 'INBOUND' ? 'Cliente' : 'Negocio'})
                  </span>
                </div>

                {message.textContent && (
                  <div className="text-gray-700 py-2">
                    {message.textContent}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  <span>Tipo: {message.type}</span>
                  {message.deliveredAt && (
                    <span>Entregado: {new Date(message.deliveredAt).toLocaleTimeString('es-ES')}</span>
                  )}
                  {message.readAt && (
                    <span>Leído: {new Date(message.readAt).toLocaleTimeString('es-ES')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
