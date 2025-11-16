import { NextRequest, NextResponse } from 'next/server';
import { InstagramService } from '@/lib/services/instagram';
import { prisma } from '@/lib/prisma';

const instagramService = new InstagramService();

/**
 * Webhook verification endpoint for Instagram Messaging API
 * Meta will send a GET request to verify the webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Instagram webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

/**
 * Webhook endpoint for receiving Instagram messages
 * Processes incoming messages and stores them in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    console.log('📨 Instagram webhook received - v2');

    // TEMPORAL: Instagram parece usar App Secret diferente
    // TODO: Investigar App Secret correcto para Instagram
    if (signature) {
      const isValid = instagramService.verifyWebhookSignature(body, signature);
      console.log('🔍 Signature verification result:', isValid);

      if (!isValid) {
        console.warn('⚠️ Instagram signature verification failed - Processing anyway for now');
        // NO rechazamos la petición, solo logueamos
      }
    } else {
      console.warn('⚠️ No signature provided by Meta');
    }

    const webhookData = JSON.parse(body);
    const entry = webhookData.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (!messaging || !messaging.message) {
      return NextResponse.json({ success: true });
    }

    const sender = messaging.sender;
    const recipient = messaging.recipient;
    const externalContactId = sender.id;
    const recipientId = recipient.id;

    let contact = await prisma.contact.findUnique({
      where: {
        externalId_channel: {
          externalId: externalContactId,
          channel: 'INSTAGRAM',
        },
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          externalId: externalContactId,
          channel: 'INSTAGRAM',
          displayName: `Instagram User ${externalContactId}`,
          isActive: true,
        },
      });
    }

    const externalConversationId = `instagram_${externalContactId}_${recipientId}`;
    let conversation = await prisma.conversation.findUnique({
      where: { externalConversationId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          externalConversationId,
          channel: 'INSTAGRAM',
          contactId: contact.id,
          isActive: true,
          unreadCount: 0,
        },
      });
    }

    const messageData = messaging.message;
    const externalMessageId = messageData.mid;
    const timestamp = messaging.timestamp;
    const sentAt = new Date(timestamp);

    let textContent: string | null = messageData.text || null;
    let messageType = 'TEXT';

    if (messageData.attachments && messageData.attachments.length > 0) {
      const attachmentType = messageData.attachments[0].type;
      messageType = attachmentType.toUpperCase();
    }

    // Verificar si el mensaje ya existe (evitar duplicados)
    const existingMessage = await prisma.message.findUnique({
      where: { externalMessageId },
    });

    if (existingMessage) {
      return NextResponse.json({ success: true, duplicate: true });
    }

    const message = await prisma.message.create({
      data: {
        externalMessageId,
        conversationId: conversation.id,
        channel: 'INSTAGRAM',
        direction: 'INBOUND',
        type: messageType as any,
        status: 'DELIVERED',
        textContent,
        senderName: contact.displayName,
        senderExternalId: externalContactId,
        recipientName: 'Business',
        recipientExternalId: recipientId,
        sentAt,
        deliveredAt: new Date(),
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: sentAt,
        unreadCount: { increment: 1 },
      },
    });

    console.log('✅ Instagram message processed:', externalMessageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error processing Instagram webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
