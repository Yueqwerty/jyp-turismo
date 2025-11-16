import crypto from 'crypto';

/**
 * Instagram Messaging API Service
 * Handles integration with Meta's Instagram Messaging API
 */
export class InstagramService {
  private accessToken: string;
  private appSecret: string;
  private apiVersion: string = 'v18.0';
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN || '';
    this.appSecret = process.env.WHATSAPP_APP_SECRET || '';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Sends a text message via Instagram Messaging API
   */
  async sendTextMessage(recipientId: string, messageText: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/me/messages?access_token=${this.accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
      }),
    });

    const data = await response.json();
    return data.message_id;
  }

  /**
   * Sends a media message via Instagram Messaging API
   */
  async sendMediaMessage(
    recipientId: string,
    mediaUrl: string,
    mediaType: string,
    caption?: string
  ): Promise<string> {
    const attachment = {
      type: mediaType,
      payload: { url: mediaUrl },
    };

    const messageObject: any = { attachment };
    if (caption) {
      messageObject.text = caption;
    }

    const response = await fetch(`${this.baseUrl}/me/messages?access_token=${this.accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: messageObject,
      }),
    });

    const data = await response.json();
    return data.message_id;
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
