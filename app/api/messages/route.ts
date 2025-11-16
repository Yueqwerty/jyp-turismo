import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación (opcional - puedes comentar esto para testing)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const channel = searchParams.get('channel'); // 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM' | null

    // Obtener todas las conversaciones con su último mensaje
    const conversations = await prisma.conversation.findMany({
      where: {
        isActive: true,
        ...(channel && channel !== 'ALL' ? { channel: channel as any } : {}),
      },
      include: {
        contact: true,
        messages: {
          orderBy: { sentAt: 'desc' },
          take: 1, // Solo el último mensaje
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      take: 100, // Limitar a las 100 conversaciones más recientes
    });

    // Transformar datos para el frontend
    const formattedMessages = conversations
      .filter(conv => conv.messages.length > 0) // Solo conversaciones con mensajes
      .map(conv => {
        const lastMessage = conv.messages[0];
        return {
          id: conv.id,
          channel: conv.channel,
          senderName: conv.contact.displayName,
          senderPhone: conv.contact.phoneNumber,
          preview: lastMessage.textContent || `[${lastMessage.type}]`,
          timestamp: lastMessage.sentAt,
          unread: conv.unreadCount > 0,
          unreadCount: conv.unreadCount,
          conversationId: conv.id,
          externalId: conv.contact.externalId,
        };
      });

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      total: formattedMessages.length,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
