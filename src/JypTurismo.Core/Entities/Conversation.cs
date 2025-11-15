using JypTurismo.Core.Enums;

namespace JypTurismo.Core.Entities;

/// <summary>
/// Represents a conversation thread with a contact on a specific channel.
/// </summary>
public class Conversation : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique identifier from the external platform.
    /// </summary>
    public string ExternalConversationId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the channel where this conversation is taking place.
    /// </summary>
    public MessageChannel Channel { get; set; }

    /// <summary>
    /// Gets or sets the contact ID associated with this conversation.
    /// </summary>
    public Guid ContactId { get; set; }

    /// <summary>
    /// Gets or sets the contact participating in this conversation.
    /// </summary>
    public virtual Contact Contact { get; set; } = null!;

    /// <summary>
    /// Gets or sets the subject or title of the conversation.
    /// </summary>
    public string? Subject { get; set; }

    /// <summary>
    /// Gets or sets whether this conversation is currently active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Gets or sets the timestamp of the last message in this conversation.
    /// </summary>
    public DateTime? LastMessageAt { get; set; }

    /// <summary>
    /// Gets or sets the number of unread messages in this conversation.
    /// </summary>
    public int UnreadCount { get; set; }

    /// <summary>
    /// Gets or sets the collection of messages in this conversation.
    /// </summary>
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
