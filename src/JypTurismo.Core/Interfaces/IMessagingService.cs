using JypTurismo.Core.Entities;

namespace JypTurismo.Core.Interfaces;

/// <summary>
/// Interface for messaging service operations across different channels.
/// </summary>
public interface IMessagingService
{
    /// <summary>
    /// Sends a text message through the specified channel.
    /// </summary>
    /// <param name="recipientId">The recipient's external ID on the platform.</param>
    /// <param name="messageText">The text content to send.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The external message ID from the platform.</returns>
    Task<string> SendTextMessageAsync(
        string recipientId,
        string messageText,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a message with media attachment.
    /// </summary>
    /// <param name="recipientId">The recipient's external ID on the platform.</param>
    /// <param name="mediaUrl">The URL of the media to send.</param>
    /// <param name="mediaType">The type of media (image, video, etc.).</param>
    /// <param name="caption">Optional caption for the media.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The external message ID from the platform.</returns>
    Task<string> SendMediaMessageAsync(
        string recipientId,
        string mediaUrl,
        string mediaType,
        string? caption = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks a message as read.
    /// </summary>
    /// <param name="messageId">The external message ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task MarkMessageAsReadAsync(string messageId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Processes an incoming webhook payload from the messaging platform.
    /// </summary>
    /// <param name="payload">The webhook payload as JSON string.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The processed message entity.</returns>
    Task<Message> ProcessIncomingWebhookAsync(
        string payload,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifies the webhook signature for security.
    /// </summary>
    /// <param name="payload">The request payload.</param>
    /// <param name="signature">The signature to verify.</param>
    /// <returns>True if the signature is valid, otherwise false.</returns>
    bool VerifyWebhookSignature(string payload, string signature);
}
