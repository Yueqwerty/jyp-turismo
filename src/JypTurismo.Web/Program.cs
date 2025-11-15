using Microsoft.EntityFrameworkCore;
using JypTurismo.Core.Interfaces;
using JypTurismo.Infrastructure.Data;
using JypTurismo.Infrastructure.Repositories;
using JypTurismo.Infrastructure.Services;
using JypTurismo.Web.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddHttpClient<WhatsAppBusinessService>();
builder.Services.AddHttpClient<MessengerService>();
builder.Services.AddHttpClient<InstagramService>();

builder.Services.AddScoped<WhatsAppBusinessService>();
builder.Services.AddScoped<MessengerService>();
builder.Services.AddScoped<InstagramService>();

builder.Services.AddSignalR();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapHub<MessagingHub>("/messagingHub");
app.MapControllers();
app.MapFallbackToPage("/_Host");

app.Run();
