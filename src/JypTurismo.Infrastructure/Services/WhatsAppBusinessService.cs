using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using JypTurismo.Core.Entities;
using JypTurismo.Core.Enums;
using JypTurismo.Core.Interfaces;

namespace JypTurismo.Infrastructure.Services;

/// <summary>
/// Service for integrating with WhatsApp Business API (Meta/Facebook).
/// </summary>
public class WhatsAppBusinessService : IMessagingService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WhatsAppBusinessService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _accessToken;
    private readonly string _phoneNumberId;
    private readonly string _appSecret;
    private readonly string _apiVersion;

    /// <summary>
    /// Initializes a new instance of the <see cref="WhatsAppBusinessService"/> class.
    /// </summary>
    /// <param name="httpClient">The HTTP client for API calls.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="unitOfWork">The unit of work for data access.</param>
    public WhatsAppBusinessService(
        HttpClient httpClient,
        ILogger<WhatsAppBusinessService> logger,
        IUnitOfWork unitOfWork)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

        _accessToken = Environment.GetEnvironmentVariable("WHATSAPP_ACCESS_TOKEN") ?? string.Empty;
        _phoneNumberId = Environment.GetEnvironmentVariable("WHATSAPP_PHONE_NUMBER_ID") ?? string.Empty;
        _appSecret = Environment.GetEnvironmentVariable("WHATSAPP_APP_SECRET") ?? string.Empty;
        _apiVersion = "v18.0";

        ConfigureHttpClient();
    }

    /// <summary>
    /// Configures the HTTP client with necessary headers and base address.
    /// </summary>
    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri($"https://graph.facebook.com/{_apiVersion}/");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    /// <inheritdoc/>
    public async Task<string> SendTextMessageAsync(
        string recipientId,
        string messageText,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var payload = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = recipientId,
                type = "text",
                text = new { body = messageText }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                $"{_phoneNumberId}/messages",
                content,
                cancellationToken);

            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var jsonResponse = JsonDocument.Parse(responseBody);
            var messageId = jsonResponse.RootElement
                .GetProperty("messages")[0]
                .GetProperty("id")
                .GetString() ?? string.Empty;

            _logger.LogInformation(
                "WhatsApp message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp message to {Recipient}", recipientId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task<string> SendMediaMessageAsync(
        string recipientId,
        string mediaUrl,
        string mediaType,
        string? caption = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mediaObject = caption != null
                ? new { link = mediaUrl, caption }
                : new { link = mediaUrl, caption = string.Empty };

            var payload = new
            {
                messaging_product = "whatsapp",
                recipient_type = "individual",
                to = recipientId,
                type = mediaType,
            };

            var payloadDict = new Dictionary<string, object>
            {
                { "messaging_product", "whatsapp" },
                { "recipient_type", "individual" },
                { "to", recipientId },
                { "type", mediaType },
                { mediaType, mediaObject }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payloadDict),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                $"{_phoneNumberId}/messages",
                content,
                cancellationToken);

            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var jsonResponse = JsonDocument.Parse(responseBody);
            var messageId = jsonResponse.RootElement
                .GetProperty("messages")[0]
                .GetProperty("id")
                .GetString() ?? string.Empty;

            _logger.LogInformation(
                "WhatsApp media message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error sending WhatsApp media message to {Recipient}",
                recipientId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task MarkMessageAsReadAsync(
        string messageId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var payload = new
            {
                messaging_product = "whatsapp",
                status = "read",
                message_id = messageId
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                $"{_phoneNumberId}/messages",
                content,
                cancellationToken);

            response.EnsureSuccessStatusCode();

            _logger.LogInformation("WhatsApp message marked as read. MessageId: {MessageId}", messageId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking WhatsApp message as read. MessageId: {MessageId}", messageId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task<Message> ProcessIncomingWebhookAsync(
        string payload,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var webhookData = JsonDocument.Parse(payload);
            var entry = webhookData.RootElement.GetProperty("entry")[0];
            var changes = entry.GetProperty("changes")[0];
            var value = changes.GetProperty("value");
            var messageData = value.GetProperty("messages")[0];

            var contactData = value.GetProperty("contacts")[0];
            var externalContactId = contactData.GetProperty("wa_id").GetString() ?? string.Empty;
            var contactName = contactData.GetProperty("profile").GetProperty("name").GetString() ?? "Unknown";

            var existingContacts = await _unitOfWork.Contacts.FindAsync(
                c => c.ExternalId == externalContactId && c.Channel == MessageChannel.WhatsAppBusiness,
                cancellationToken);

            var contact = existingContacts.FirstOrDefault();
            if (contact == null)
            {
                contact = new Contact
                {
                    ExternalId = externalContactId,
                    Channel = MessageChannel.WhatsAppBusiness,
                    DisplayName = contactName,
                    PhoneNumber = externalContactId,
                    IsActive = true
                };
                await _unitOfWork.Contacts.AddAsync(contact, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            var externalConversationId = $"whatsapp_{externalContactId}";
            var existingConversations = await _unitOfWork.Conversations.FindAsync(
                cv => cv.ExternalConversationId == externalConversationId,
                cancellationToken);

            var conversation = existingConversations.FirstOrDefault();
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    ExternalConversationId = externalConversationId,
                    Channel = MessageChannel.WhatsAppBusiness,
                    ContactId = contact.Id,
                    IsActive = true,
                    UnreadCount = 0
                };
                await _unitOfWork.Conversations.AddAsync(conversation, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            var externalMessageId = messageData.GetProperty("id").GetString() ?? string.Empty;
            var messageType = messageData.GetProperty("type").GetString() ?? "text";
            var timestamp = messageData.GetProperty("timestamp").GetString() ?? string.Empty;
            var sentAt = DateTimeOffset.FromUnixTimeSeconds(long.Parse(timestamp)).UtcDateTime;

            string? textContent = null;
            if (messageType == "text")
            {
                textContent = messageData.GetProperty("text").GetProperty("body").GetString();
            }

            var message = new Message
            {
                ExternalMessageId = externalMessageId,
                ConversationId = conversation.Id,
                Channel = MessageChannel.WhatsAppBusiness,
                Direction = MessageDirection.Inbound,
                Type = MapMessageType(messageType),
                Status = MessageStatus.Delivered,
                TextContent = textContent,
                SenderName = contactName,
                SenderExternalId = externalContactId,
                RecipientName = "Business",
                RecipientExternalId = _phoneNumberId,
                SentAt = sentAt,
                DeliveredAt = DateTime.UtcNow
            };

            await _unitOfWork.Messages.AddAsync(message, cancellationToken);

            conversation.LastMessageAt = sentAt;
            conversation.UnreadCount++;
            _unitOfWork.Conversations.Update(conversation);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "WhatsApp webhook processed successfully. MessageId: {MessageId}",
                externalMessageId);

            return message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing WhatsApp webhook");
            throw;
        }
    }

    /// <inheritdoc/>
    public bool VerifyWebhookSignature(string payload, string signature)
    {
        try
        {
            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Webhook signature is missing");
                return false;
            }

            signature = signature.Replace("sha256=", string.Empty);

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_appSecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var computedSignature = BitConverter.ToString(hash).Replace("-", string.Empty).ToLower();

            var isValid = computedSignature.Equals(signature, StringComparison.OrdinalIgnoreCase);

            if (!isValid)
            {
                _logger.LogWarning("WhatsApp webhook signature verification failed");
            }

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying WhatsApp webhook signature");
            return false;
        }
    }

    /// <summary>
    /// Maps WhatsApp message type to internal MessageType enum.
    /// </summary>
    /// <param name="whatsappType">The WhatsApp message type.</param>
    /// <returns>The internal MessageType.</returns>
    private static MessageType MapMessageType(string whatsappType)
    {
        return whatsappType.ToLower() switch
        {
            "text" => MessageType.Text,
            "image" => MessageType.Image,
            "video" => MessageType.Video,
            "audio" => MessageType.Audio,
            "document" => MessageType.Document,
            "location" => MessageType.Location,
            "contacts" => MessageType.Contact,
            "sticker" => MessageType.Sticker,
            _ => MessageType.Text
        };
    }
}
