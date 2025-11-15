using Microsoft.AspNetCore.SignalR;
using JypTurismo.Core.Entities;

namespace JypTurismo.Web.Hubs;

/// <summary>
/// SignalR hub for real-time messaging updates.
/// </summary>
public class MessagingHub : Hub
{
    private readonly ILogger<MessagingHub> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="MessagingHub"/> class.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    public MessagingHub(ILogger<MessagingHub> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles client connection.
    /// </summary>
    /// <returns>A task representing the asynchronous operation.</returns>
    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Handles client disconnection.
    /// </summary>
    /// <param name="exception">The exception that caused the disconnection, if any.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation(
            "Client disconnected: {ConnectionId}. Exception: {Exception}",
            Context.ConnectionId,
            exception?.Message ?? "None");
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Broadcasts a new message to all connected clients.
    /// </summary>
    /// <param name="message">The message to broadcast.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task BroadcastMessage(Message message)
    {
        _logger.LogInformation("Broadcasting message: {MessageId}", message.Id);
        await Clients.All.SendAsync("ReceiveMessage", message);
    }

    /// <summary>
    /// Sends a typing indicator to all clients.
    /// </summary>
    /// <param name="conversationId">The conversation ID where typing is occurring.</param>
    /// <param name="isTyping">Whether the user is currently typing.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task SendTypingIndicator(Guid conversationId, bool isTyping)
    {
        await Clients.Others.SendAsync("TypingIndicator", conversationId, isTyping);
    }

    /// <summary>
    /// Updates the read status of messages in a conversation.
    /// </summary>
    /// <param name="conversationId">The conversation ID.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task MarkConversationAsRead(Guid conversationId)
    {
        await Clients.All.SendAsync("ConversationRead", conversationId);
    }
}
