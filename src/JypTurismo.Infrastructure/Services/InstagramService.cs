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
/// Service for integrating with Instagram Messaging API (Meta/Facebook).
/// </summary>
public class InstagramService : IMessagingService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<InstagramService> _logger;
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _accessToken;
    private readonly string _appSecret;
    private readonly string _apiVersion;

    /// <summary>
    /// Initializes a new instance of the <see cref="InstagramService"/> class.
    /// </summary>
    /// <param name="httpClient">The HTTP client for API calls.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="unitOfWork">The unit of work for data access.</param>
    public InstagramService(
        HttpClient httpClient,
        ILogger<InstagramService> logger,
        IUnitOfWork unitOfWork)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));

        _accessToken = Environment.GetEnvironmentVariable("INSTAGRAM_ACCESS_TOKEN") ?? string.Empty;
        _appSecret = Environment.GetEnvironmentVariable("INSTAGRAM_APP_SECRET") ?? string.Empty;
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
                message = new { text = messageText }
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
                "Instagram message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Instagram message to {Recipient}", recipientId);
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
                payload = new { url = mediaUrl }
            };

            var messageObject = caption != null
                ? new { attachment, text = caption }
                : new { attachment };

            var payload = new
            {
                recipient = new { id = recipientId },
                message = messageObject
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
                "Instagram media message sent successfully. MessageId: {MessageId}, Recipient: {Recipient}",
                messageId,
                recipientId);

            return messageId;
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Error sending Instagram media message to {Recipient}",
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
        _logger.LogInformation("Instagram does not require explicit read confirmation for message {MessageId}", messageId);
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
                c => c.ExternalId == externalContactId && c.Channel == MessageChannel.Instagram,
                cancellationToken);

            var contact = existingContacts.FirstOrDefault();
            if (contact == null)
            {
                contact = new Contact
                {
                    ExternalId = externalContactId,
                    Channel = MessageChannel.Instagram,
                    DisplayName = $"Instagram User {externalContactId}",
                    IsActive = true
                };
                await _unitOfWork.Contacts.AddAsync(contact, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            var externalConversationId = $"instagram_{externalContactId}_{recipientId}";
            var existingConversations = await _unitOfWork.Conversations.FindAsync(
                cv => cv.ExternalConversationId == externalConversationId,
                cancellationToken);

            var conversation = existingConversations.FirstOrDefault();
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    ExternalConversationId = externalConversationId,
                    Channel = MessageChannel.Instagram,
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
                Channel = MessageChannel.Instagram,
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
                "Instagram webhook processed successfully. MessageId: {MessageId}",
                externalMessageId);

            return message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Instagram webhook");
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
                _logger.LogWarning("Instagram webhook signature verification failed");
            }

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Instagram webhook signature");
            return false;
        }
    }

    /// <summary>
    /// Maps Instagram attachment type to internal MessageType enum.
    /// </summary>
    /// <param name="instagramType">The Instagram attachment type.</param>
    /// <returns>The internal MessageType.</returns>
    private static MessageType MapMessageType(string instagramType)
    {
        return instagramType.ToLower() switch
        {
            "image" => MessageType.Image,
            "video" => MessageType.Video,
            "audio" => MessageType.Audio,
            "file" => MessageType.Document,
            "story_mention" => MessageType.Text,
            _ => MessageType.Text
        };
    }
}
