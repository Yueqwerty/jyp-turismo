import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;

    // Obtener la conversación con todos sus mensajes
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        messages: {
          orderBy: { sentAt: 'asc' },
          include: {
            attachments: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Marcar mensajes como leídos
    await prisma.message.updateMany({
      where: {
        conversationId,
        direction: 'INBOUND',
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    // Resetear contador de no leídos
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 },
    });

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        channel: conversation.channel,
        contact: {
          name: conversation.contact.displayName,
          phone: conversation.contact.phoneNumber,
          externalId: conversation.contact.externalId,
        },
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          type: msg.type,
          text: msg.textContent,
          direction: msg.direction,
          sentAt: msg.sentAt,
          deliveredAt: msg.deliveredAt,
          readAt: msg.readAt,
          senderName: msg.senderName,
          attachments: msg.attachments,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
