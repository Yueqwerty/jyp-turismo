namespace JypTurismo.Core.Enums;

/// <summary>
/// Represents the direction of a message flow.
/// </summary>
public enum MessageDirection
{
    /// <summary>
    /// Message received from a customer.
    /// </summary>
    Inbound = 1,

    /// <summary>
    /// Message sent to a customer.
    /// </summary>
    Outbound = 2
}
