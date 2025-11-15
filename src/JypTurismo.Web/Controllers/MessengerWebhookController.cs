using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using JypTurismo.Infrastructure.Services;
using JypTurismo.Web.Hubs;

namespace JypTurismo.Web.Controllers;

/// <summary>
/// Controller for handling Facebook Messenger webhooks.
/// </summary>
[ApiController]
[Route("api/webhooks/messenger")]
public class MessengerWebhookController : ControllerBase
{
    private readonly MessengerService _messengerService;
    private readonly IHubContext<MessagingHub> _hubContext;
    private readonly ILogger<MessengerWebhookController> _logger;
    private readonly string _verifyToken;

    /// <summary>
    /// Initializes a new instance of the <see cref="MessengerWebhookController"/> class.
    /// </summary>
    /// <param name="messengerService">The Messenger service.</param>
    /// <param name="hubContext">The SignalR hub context.</param>
    /// <param name="logger">The logger instance.</param>
    public MessengerWebhookController(
        MessengerService messengerService,
        IHubContext<MessagingHub> hubContext,
        ILogger<MessengerWebhookController> logger)
    {
        _messengerService = messengerService ?? throw new ArgumentNullException(nameof(messengerService));
        _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _verifyToken = Environment.GetEnvironmentVariable("MESSENGER_VERIFY_TOKEN") ?? string.Empty;
    }

    /// <summary>
    /// Handles webhook verification from Meta.
    /// </summary>
    /// <param name="mode">The mode parameter from Meta.</param>
    /// <param name="token">The verify token from Meta.</param>
    /// <param name="challenge">The challenge string from Meta.</param>
    /// <returns>The challenge string if verification succeeds.</returns>
    [HttpGet]
    public IActionResult Verify(
        [FromQuery(Name = "hub.mode")] string mode,
        [FromQuery(Name = "hub.verify_token")] string token,
        [FromQuery(Name = "hub.challenge")] string challenge)
    {
        _logger.LogInformation("Messenger webhook verification request received");

        if (mode == "subscribe" && token == _verifyToken)
        {
            _logger.LogInformation("Messenger webhook verified successfully");
            return Ok(challenge);
        }

        _logger.LogWarning("Messenger webhook verification failed");
        return Forbid();
    }

    /// <summary>
    /// Handles incoming webhook events from Facebook Messenger.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Action result indicating success or failure.</returns>
    [HttpPost]
    public async Task<IActionResult> Webhook(CancellationToken cancellationToken)
    {
        try
        {
            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync(cancellationToken);

            if (string.IsNullOrEmpty(payload))
            {
                _logger.LogWarning("Received empty Messenger webhook payload");
                return BadRequest("Empty payload");
            }

            var signature = Request.Headers["X-Hub-Signature-256"].ToString();
            if (!_messengerService.VerifyWebhookSignature(payload, signature))
            {
                _logger.LogWarning("Messenger webhook signature verification failed");
                return Unauthorized("Invalid signature");
            }

            var message = await _messengerService.ProcessIncomingWebhookAsync(payload, cancellationToken);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message, cancellationToken);

            _logger.LogInformation("Messenger webhook processed successfully");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Messenger webhook");
            return StatusCode(500, "Internal server error");
        }
    }
}
