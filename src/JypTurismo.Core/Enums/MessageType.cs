namespace JypTurismo.Core.Enums;

/// <summary>
/// Represents the type of content in a message.
/// </summary>
public enum MessageType
{
    /// <summary>
    /// Plain text message.
    /// </summary>
    Text = 1,

    /// <summary>
    /// Image attachment.
    /// </summary>
    Image = 2,

    /// <summary>
    /// Video attachment.
    /// </summary>
    Video = 3,

    /// <summary>
    /// Audio or voice message.
    /// </summary>
    Audio = 4,

    /// <summary>
    /// Document or file attachment.
    /// </summary>
    Document = 5,

    /// <summary>
    /// Location coordinates.
    /// </summary>
    Location = 6,

    /// <summary>
    /// Contact information.
    /// </summary>
    Contact = 7,

    /// <summary>
    /// Sticker or emoji.
    /// </summary>
    Sticker = 8
}
