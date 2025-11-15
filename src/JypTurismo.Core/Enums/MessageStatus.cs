namespace JypTurismo.Core.Enums;

/// <summary>
/// Represents the delivery and read status of a message.
/// </summary>
public enum MessageStatus
{
    /// <summary>
    /// Message is queued for sending.
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Message has been sent to the channel.
    /// </summary>
    Sent = 2,

    /// <summary>
    /// Message has been delivered to the recipient.
    /// </summary>
    Delivered = 3,

    /// <summary>
    /// Message has been read by the recipient.
    /// </summary>
    Read = 4,

    /// <summary>
    /// Message sending failed.
    /// </summary>
    Failed = 5
}
