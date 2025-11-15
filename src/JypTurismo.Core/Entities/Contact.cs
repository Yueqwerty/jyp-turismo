using JypTurismo.Core.Enums;

namespace JypTurismo.Core.Entities;

/// <summary>
/// Represents a contact from any messaging channel.
/// </summary>
public class Contact : BaseEntity
{
    /// <summary>
    /// Gets or sets the unique identifier from the external platform.
    /// </summary>
    public string ExternalId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the channel where this contact originated.
    /// </summary>
    public MessageChannel Channel { get; set; }

    /// <summary>
    /// Gets or sets the display name of the contact.
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the phone number (for WhatsApp).
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Gets or sets the email address if available.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the profile picture URL.
    /// </summary>
    public string? ProfilePictureUrl { get; set; }

    /// <summary>
    /// Gets or sets additional metadata as JSON.
    /// </summary>
    public string? Metadata { get; set; }

    /// <summary>
    /// Gets or sets whether this contact is active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Gets or sets the collection of conversations for this contact.
    /// </summary>
    public virtual ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
