import { NextRequest, NextResponse } from 'next/server';
import { MessengerService } from '@/lib/services/messenger';
import { prisma } from '@/lib/prisma';

const messengerService = new MessengerService();

/**
 * Webhook verification endpoint for Messenger API
 * Meta will send a GET request to verify the webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.MESSENGER_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Messenger webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

/**
 * Webhook endpoint for receiving Messenger messages
 * Processes incoming messages and stores them in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    if (!messengerService.verifyWebhookSignature(body, signature)) {
      console.warn('Messenger webhook signature verification failed');
      return new NextResponse('Unauthorized', { status: 401 });
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
          channel: 'MESSENGER',
        },
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          externalId: externalContactId,
          channel: 'MESSENGER',
          displayName: `Messenger User ${externalContactId}`,
          isActive: true,
        },
      });
    }

    const externalConversationId = `messenger_${externalContactId}_${recipientId}`;
    let conversation = await prisma.conversation.findUnique({
      where: { externalConversationId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          externalConversationId,
          channel: 'MESSENGER',
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

    const message = await prisma.message.create({
      data: {
        externalMessageId,
        conversationId: conversation.id,
        channel: 'MESSENGER',
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

    console.log('Messenger message processed successfully:', externalMessageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Messenger webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
