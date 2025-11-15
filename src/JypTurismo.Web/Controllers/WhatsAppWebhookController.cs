using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using JypTurismo.Core.Interfaces;
using JypTurismo.Infrastructure.Services;
using JypTurismo.Web.Hubs;

namespace JypTurismo.Web.Controllers;

/// <summary>
/// Controller for handling WhatsApp Business webhooks.
/// </summary>
[ApiController]
[Route("api/webhooks/whatsapp")]
public class WhatsAppWebhookController : ControllerBase
{
    private readonly WhatsAppBusinessService _whatsAppService;
    private readonly IHubContext<MessagingHub> _hubContext;
    private readonly ILogger<WhatsAppWebhookController> _logger;
    private readonly string _verifyToken;

    /// <summary>
    /// Initializes a new instance of the <see cref="WhatsAppWebhookController"/> class.
    /// </summary>
    /// <param name="whatsAppService">The WhatsApp Business service.</param>
    /// <param name="hubContext">The SignalR hub context.</param>
    /// <param name="logger">The logger instance.</param>
    public WhatsAppWebhookController(
        WhatsAppBusinessService whatsAppService,
        IHubContext<MessagingHub> hubContext,
        ILogger<WhatsAppWebhookController> logger)
    {
        _whatsAppService = whatsAppService ?? throw new ArgumentNullException(nameof(whatsAppService));
        _hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _verifyToken = Environment.GetEnvironmentVariable("WHATSAPP_VERIFY_TOKEN") ?? string.Empty;
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
        _logger.LogInformation("WhatsApp webhook verification request received");

        if (mode == "subscribe" && token == _verifyToken)
        {
            _logger.LogInformation("WhatsApp webhook verified successfully");
            return Ok(challenge);
        }

        _logger.LogWarning("WhatsApp webhook verification failed");
        return Forbid();
    }

    /// <summary>
    /// Handles incoming webhook events from WhatsApp Business.
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
                _logger.LogWarning("Received empty WhatsApp webhook payload");
                return BadRequest("Empty payload");
            }

            var signature = Request.Headers["X-Hub-Signature-256"].ToString();
            if (!_whatsAppService.VerifyWebhookSignature(payload, signature))
            {
                _logger.LogWarning("WhatsApp webhook signature verification failed");
                return Unauthorized("Invalid signature");
            }

            var message = await _whatsAppService.ProcessIncomingWebhookAsync(payload, cancellationToken);

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message, cancellationToken);

            _logger.LogInformation("WhatsApp webhook processed successfully");
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing WhatsApp webhook");
            return StatusCode(500, "Internal server error");
        }
    }
}
