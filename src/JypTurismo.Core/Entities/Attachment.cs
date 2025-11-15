using JypTurismo.Core.Enums;

namespace JypTurismo.Core.Entities;

/// <summary>
/// Represents a file attachment associated with a message.
/// </summary>
public class Attachment : BaseEntity
{
    /// <summary>
    /// Gets or sets the message ID this attachment belongs to.
    /// </summary>
    public Guid MessageId { get; set; }

    /// <summary>
    /// Gets or sets the message this attachment belongs to.
    /// </summary>
    public virtual Message Message { get; set; } = null!;

    /// <summary>
    /// Gets or sets the type of attachment.
    /// </summary>
    public MessageType Type { get; set; }

    /// <summary>
    /// Gets or sets the original filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the MIME type of the file.
    /// </summary>
    public string MimeType { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the file size in bytes.
    /// </summary>
    public long FileSize { get; set; }

    /// <summary>
    /// Gets or sets the URL where the file is stored.
    /// </summary>
    public string FileUrl { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the thumbnail URL for images and videos.
    /// </summary>
    public string? ThumbnailUrl { get; set; }

    /// <summary>
    /// Gets or sets the external URL from the messaging platform.
    /// </summary>
    public string? ExternalUrl { get; set; }
}
