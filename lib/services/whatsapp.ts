import crypto from 'crypto';

/**
 * WhatsApp Business API Service
 * Handles integration with Meta's WhatsApp Business API
 */
export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private appSecret: string;
  private apiVersion: string = 'v18.0';
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.appSecret = process.env.WHATSAPP_APP_SECRET || '';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Sends a text message via WhatsApp Business API
   */
  async sendTextMessage(recipientId: string, messageText: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientId,
        type: 'text',
        text: { body: messageText },
      }),
    });

    const data = await response.json();
    return data.messages[0].id;
  }

  /**
   * Sends a media message via WhatsApp Business API
   */
  async sendMediaMessage(
    recipientId: string,
    mediaUrl: string,
    mediaType: string,
    caption?: string
  ): Promise<string> {
    const mediaObject: any = { link: mediaUrl };
    if (caption) {
      mediaObject.caption = caption;
    }

    const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientId,
        type: mediaType,
        [mediaType]: mediaObject,
      }),
    });

    const data = await response.json();
    return data.messages[0].id;
  }

  /**
   * Marks a message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  }

  /**
   * Verifies webhook signature from Meta
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!signature) return false;

    const signatureHash = signature.replace('sha256=', '');
    const hmac = crypto.createHmac('sha256', this.appSecret);
    const digest = hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signatureHash),
      Buffer.from(digest)
    );
  }
}
