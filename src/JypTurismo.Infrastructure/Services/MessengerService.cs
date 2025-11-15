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
/// Service for integrating with Facebook Messenger API (Meta/Facebook).
/// </summary>
public class MessengerService : IMessagingService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<MessengerService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _accessToken;
    private readonly string _appSecret;
    private readonly string _apiVersion;

    /// <summary>
    /// Initializes a new instance of the <see cref="MessengerService"/> class.
    /// </summary>
    /// <param name="httpClient">The HTTP client for API calls.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="unitOfWork">The unit of work for data access.</param>
    public MessengerService(
        HttpClient httpClient,
        ILogger<MessengerService> logger,
        IUnitOfWork unitOfWork)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

        _accessToken = Environment.GetEnvironmentVariable("MESSENGER_ACCESS_TOKEN") ?? string.Empty;
        _appSecret = Environment.GetEnvironmentVariable("MESSENGER_APP_SECRET") ?? string.Empty;
        _apiVersion = "v18.0";

        ConfigureHttpClient();
    }

    /// <summary>
    /// Configures the HTTP client with necessary headers and base address.
    /// </summary>
    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri($"https://graph.facebook.com/{_apiVersion}/");
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
                recipient = new { id = recipientId },
                message = new { text = messageText },
                messaging_type = "RESPONSE"
            };

            var requestUri = $"me/messages?access_token={_accessToken}";
            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(requestUri, content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var jsonResponse = JsonDocument.Parse(responseBody);
            var messageId = jsonResponse.RootElement
                .GetProperty("message_id")
                .GetString() ?? string.Empty;

            _logger.LogInformation(
                "Messenger message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Messenger message to {Recipient}", recipientId);
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
            var attachment = new
            {
                type = mediaType,
                payload = new { url = mediaUrl, is_reusable = true }
            };

            var messageObject = caption != null
                ? new { attachment, text = caption }
                : new { attachment };

            var payload = new
            {
                recipient = new { id = recipientId },
                message = messageObject,
                messaging_type = "RESPONSE"
            };

            var requestUri = $"me/messages?access_token={_accessToken}";
            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(requestUri, content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var jsonResponse = JsonDocument.Parse(responseBody);
            var messageId = jsonResponse.RootElement
                .GetProperty("message_id")
                .GetString() ?? string.Empty;

            _logger.LogInformation(
                "Messenger media message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error sending Messenger media message to {Recipient}",
                recipientId);
            throw;
        }
    }

    /// <inheritdoc/>
    public async Task MarkMessageAsReadAsync(
        string messageId,
        CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
        _logger.LogInformation("Messenger does not require explicit read confirmation for message {MessageId}", messageId);
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
            var messaging = entry.GetProperty("messaging")[0];

            var sender = messaging.GetProperty("sender");
            var recipient = messaging.GetProperty("recipient");
            var externalContactId = sender.GetProperty("id").GetString() ?? string.Empty;
            var recipientId = recipient.GetProperty("id").GetString() ?? string.Empty;

            var existingContacts = await _unitOfWork.Contacts.FindAsync(
                c => c.ExternalId == externalContactId && c.Channel == MessageChannel.Messenger,
                cancellationToken);

            var contact = existingContacts.FirstOrDefault();
            if (contact == null)
            {
                contact = new Contact
                {
                    ExternalId = externalContactId,
                    Channel = MessageChannel.Messenger,
                    DisplayName = $"Messenger User {externalContactId}",
                    IsActive = true
                };
                await _unitOfWork.Contacts.AddAsync(contact, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            var externalConversationId = $"messenger_{externalContactId}_{recipientId}";
            var existingConversations = await _unitOfWork.Conversations.FindAsync(
                cv => cv.ExternalConversationId == externalConversationId,
                cancellationToken);

            var conversation = existingConversations.FirstOrDefault();
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    ExternalConversationId = externalConversationId,
                    Channel = MessageChannel.Messenger,
                    ContactId = contact.Id,
                    IsActive = true,
                    UnreadCount = 0
                };
                await _unitOfWork.Conversations.AddAsync(conversation, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            var messageData = messaging.GetProperty("message");
            var externalMessageId = messageData.GetProperty("mid").GetString() ?? string.Empty;
            var timestamp = messaging.GetProperty("timestamp").GetInt64();
            var sentAt = DateTimeOffset.FromUnixTimeMilliseconds(timestamp).UtcDateTime;

            string? textContent = null;
            var messageType = MessageType.Text;

            if (messageData.TryGetProperty("text", out var textElement))
            {
                textContent = textElement.GetString();
            }
            else if (messageData.TryGetProperty("attachments", out var attachmentsElement))
            {
                var attachment = attachmentsElement[0];
                var attachmentType = attachment.GetProperty("type").GetString() ?? "file";
                messageType = MapMessageType(attachmentType);
            }

            var message = new Message
            {
                ExternalMessageId = externalMessageId,
                ConversationId = conversation.Id,
                Channel = MessageChannel.Messenger,
                Direction = MessageDirection.Inbound,
                Type = messageType,
                Status = MessageStatus.Delivered,
                TextContent = textContent,
                SenderName = contact.DisplayName,
                SenderExternalId = externalContactId,
                RecipientName = "Business",
                RecipientExternalId = recipientId,
                SentAt = sentAt,
                DeliveredAt = DateTime.UtcNow
            };

            await _unitOfWork.Messages.AddAsync(message, cancellationToken);

            conversation.LastMessageAt = sentAt;
            conversation.UnreadCount++;
            _unitOfWork.Conversations.Update(conversation);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Messenger webhook processed successfully. MessageId: {MessageId}",
                externalMessageId);

            return message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Messenger webhook");
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
                _logger.LogWarning("Messenger webhook signature verification failed");
            }

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Messenger webhook signature");
            return false;
        }
    }

    /// <summary>
    /// Maps Messenger attachment type to internal MessageType enum.
    /// </summary>
    /// <param name="messengerType">The Messenger attachment type.</param>
    /// <returns>The internal MessageType.</returns>
    private static MessageType MapMessageType(string messengerType)
    {
        return messengerType.ToLower() switch
        {
            "image" => MessageType.Image,
            "video" => MessageType.Video,
            "audio" => MessageType.Audio,
            "file" => MessageType.Document,
            "location" => MessageType.Location,
            _ => MessageType.Text
        };
    }
}
