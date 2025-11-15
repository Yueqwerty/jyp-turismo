using JypTurismo.Core.Enums;

namespace JypTurismo.Core.Entities;

/// <summary>
/// Represents a unified message from any messaging channel.
/// </summary>
public class Message : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique identifier from the external platform.
    /// </summary>
    public string ExternalMessageId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the conversation ID this message belongs to.
    /// </summary>
    public Guid ConversationId { get; set; }

    /// <summary>
    /// Gets or sets the conversation this message belongs to.
    /// </summary>
    public virtual Conversation Conversation { get; set; } = null!;

    /// <summary>
    /// Gets or sets the channel where this message was sent or received.
    /// </summary>
    public MessageChannel Channel { get; set; }

    /// <summary>
    /// Gets or sets the direction of the message (inbound or outbound).
    /// </summary>
    public MessageDirection Direction { get; set; }

    /// <summary>
    /// Gets or sets the type of content in the message.
    /// </summary>
    public MessageType Type { get; set; }

    /// <summary>
    /// Gets or sets the current status of the message.
    /// </summary>
    public MessageStatus Status { get; set; }

    /// <summary>
    /// Gets or sets the text content of the message.
    /// </summary>
    public string? TextContent { get; set; }

    /// <summary>
    /// Gets or sets the sender's name or identifier.
    /// </summary>
    public string SenderName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the sender's external ID.
    /// </summary>
    public string SenderExternalId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the recipient's name or identifier.
    /// </summary>
    public string RecipientName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the recipient's external ID.
    /// </summary>
    public string RecipientExternalId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the timestamp when the message was sent.
    /// </summary>
    public DateTime SentAt { get; set; }

    /// <summary>
    /// Gets or sets the timestamp when the message was delivered.
    /// </summary>
    public DateTime? DeliveredAt { get; set; }

    /// <summary>
    /// Gets or sets the timestamp when the message was read.
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Gets or sets additional metadata as JSON.
    /// </summary>
    public string? Metadata { get; set; }

    /// <summary>
    /// Gets or sets the error message if the message failed to send.
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// Gets or sets the collection of attachments for this message.
    /// </summary>
    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}
