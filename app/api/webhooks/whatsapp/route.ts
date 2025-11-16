import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/services/whatsapp';
import { prisma } from '@/lib/prisma';

const whatsappService = new WhatsAppService();

/**
 * Webhook verification endpoint for WhatsApp Business API
 * Meta will send a GET request to verify the webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WhatsApp webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

/**
 * Webhook endpoint for receiving WhatsApp messages
 * Processes incoming messages and stores them in the database
 */
export async function POST(request: NextRequest) {
  console.log('🎯 WEBHOOK CALLED - START');

  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    console.log('📨 WhatsApp webhook received');
    console.log('📋 Body:', body);
    console.log('🔐 Signature present:', !!signature);
    console.log('🔑 App Secret configured:', !!process.env.WHATSAPP_APP_SECRET);
    console.log('💾 Database URL configured:', !!process.env.DATABASE_URL);
    console.log('🔑 Meta Token configured:', !!process.env.META_ACCESS_TOKEN);

    // TEMPORALMENTE: No verificar firma para debugging
    // if (signature && !whatsappService.verifyWebhookSignature(body, signature)) {
    //   console.warn('❌ WhatsApp webhook signature verification failed');
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }
    console.log('⚠️ SIGNATURE VERIFICATION DISABLED FOR DEBUGGING');

    const webhookData = JSON.parse(body);
    console.log('📦 Webhook data parsed:', JSON.stringify(webhookData, null, 2));

    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messageData = value?.messages?.[0];

    console.log('💬 Message data:', messageData);

    if (!messageData) {
      console.log('⚠️ No message data found, returning success');
      return NextResponse.json({ success: true });
    }

    const contactData = value.contacts?.[0];
    const externalContactId = contactData?.wa_id || '';
    const contactName = contactData?.profile?.name || 'Unknown';

    console.log('👤 Contact ID:', externalContactId, 'Name:', contactName);

    let contact = await prisma.contact.findUnique({
      where: {
        externalId_channel: {
          externalId: externalContactId,
          channel: 'WHATSAPP',
        },
      },
    });

    if (!contact) {
      console.log('✨ Creating new contact');
      contact = await prisma.contact.create({
        data: {
          externalId: externalContactId,
          channel: 'WHATSAPP',
          displayName: contactName,
          phoneNumber: externalContactId,
          isActive: true,
        },
      });
      console.log('✅ Contact created:', contact.id);
    } else {
      console.log('♻️ Existing contact found:', contact.id);
    }

    const externalConversationId = `whatsapp_${externalContactId}`;
    let conversation = await prisma.conversation.findUnique({
      where: { externalConversationId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          externalConversationId,
          channel: 'WHATSAPP',
          contactId: contact.id,
          isActive: true,
          unreadCount: 0,
        },
      });
    }

    const externalMessageId = messageData.id;
    const messageType = messageData.type || 'text';
    const timestamp = messageData.timestamp;
    const sentAt = new Date(parseInt(timestamp) * 1000);

    let textContent: string | null = null;
    if (messageType === 'text') {
      textContent = messageData.text?.body || null;
    }

    const message = await prisma.message.create({
      data: {
        externalMessageId,
        conversationId: conversation.id,
        channel: 'WHATSAPP',
        direction: 'INBOUND',
        type: messageType.toUpperCase() as any,
        status: 'DELIVERED',
        textContent,
        senderName: contactName,
        senderExternalId: externalContactId,
        recipientName: 'Business',
        recipientExternalId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
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

    console.log('✅ WhatsApp message processed successfully:', externalMessageId);
    console.log('💾 Message saved with ID:', message.id);
    console.log('📊 Conversation updated:', conversation.id);

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
