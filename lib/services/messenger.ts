import crypto from 'crypto';

/**
 * Facebook Messenger API Service
 * Handles integration with Meta's Messenger API
 */
export class MessengerService {
  private accessToken: string;
  private appSecret: string;
  private apiVersion: string = 'v18.0';
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.MESSENGER_ACCESS_TOKEN || '';
    this.appSecret = process.env.MESSENGER_APP_SECRET || '';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Sends a text message via Messenger API
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
        messaging_type: 'RESPONSE',
      }),
    });

    const data = await response.json();
    return data.message_id;
  }

  /**
   * Sends a media message via Messenger API
   */
  async sendMediaMessage(
    recipientId: string,
    mediaUrl: string,
    mediaType: string,
    caption?: string
  ): Promise<string> {
    const attachment = {
      type: mediaType,
      payload: { url: mediaUrl, is_reusable: true },
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
        messaging_type: 'RESPONSE',
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
