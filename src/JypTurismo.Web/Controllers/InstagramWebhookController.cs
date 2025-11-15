using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using JypTurismo.Infrastructure.Services;
using JypTurismo.Web.Hubs;

namespace JypTurismo.Web.Controllers;

/// <summary>
/// Controller for handling Instagram Messaging webhooks.
/// </summary>
[ApiController]
[Route("api/webhooks/instagram")]
public class InstagramWebhookController : ControllerBase
{
    private readonly InstagramService _instagramService;
    private readonly IHubContext<MessagingHub> _hubContext;
    private readonly ILogger<InstagramWebhookController> _logger;
    private readonly string _verifyToken;

    /// <summary>
    /// Initializes a new instance of the <see cref="InstagramWebhookController"/> class.
    /// </summary>
    /// <param name="instagramService">The Instagram service.</param>
    /// <param name="hubContext">The SignalR hub context.</param>
    /// <param name="logger">The logger instance.</param>
    public InstagramWebhookController(
        InstagramService instagramService,
        IHubContext<MessagingHub> hubContext,
        ILogger<InstagramWebhookController> logger)
    {
        _instagramService = instagramService ?? throw new ArgumentNullException(nameof(instagramService));
        _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _verifyToken = Environment.GetEnvironmentVariable("INSTAGRAM_VERIFY_TOKEN") ?? string.Empty;
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
        _logger.LogInformation("Instagram webhook verification request received");

        if (mode == "subscribe" && token == _verifyToken)
        {
            _logger.LogInformation("Instagram webhook verified successfully");
            return Ok(challenge);
        }

        _logger.LogWarning("Instagram webhook verification failed");
        return Forbid();
    }

    /// <summary>
    /// Handles incoming webhook events from Instagram Messaging.
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
                _logger.LogWarning("Received empty Instagram webhook payload");
                return BadRequest("Empty payload");
            }

            var signature = Request.Headers["X-Hub-Signature-256"].ToString();
            if (!_instagramService.VerifyWebhookSignature(payload, signature))
            {
                _logger.LogWarning("Instagram webhook signature verification failed");
                return Unauthorized("Invalid signature");
            }

            var message = await _instagramService.ProcessIncomingWebhookAsync(payload, cancellationToken);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message, cancellationToken);

            _logger.LogInformation("Instagram webhook processed successfully");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Instagram webhook");
            return StatusCode(500, "Internal server error");
        }
    }
}
