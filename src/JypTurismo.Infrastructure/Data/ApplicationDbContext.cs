using Microsoft.EntityFrameworkCore;
using JypTurismo.Core.Entities;
using JypTurismo.Infrastructure.Data.Configurations;

namespace JypTurismo.Infrastructure.Data;

/// <summary>
/// Application database context for Entity Framework Core.
/// </summary>
public class ApplicationDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class.
    /// </summary>
    /// <param name="options">The database context options.</param>
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Gets or sets the Messages DbSet.
    /// </summary>
    public DbSet<Message> Messages { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Conversations DbSet.
    /// </summary>
    public DbSet<Conversation> Conversations { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Contacts DbSet.
    /// </summary>
    public DbSet<Contact> Contacts { get; set; } = null!;

    /// <summary>
    /// Gets or sets the Attachments DbSet.
    /// </summary>
    public DbSet<Attachment> Attachments { get; set; } = null!;

    /// <summary>
    /// Configures the model using Fluent API.
    /// </summary>
    /// <param name="modelBuilder">The model builder.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new MessageConfiguration());
        modelBuilder.ApplyConfiguration(new ConversationConfiguration());
        modelBuilder.ApplyConfiguration(new ContactConfiguration());
        modelBuilder.ApplyConfiguration(new AttachmentConfiguration());
    }

    /// <summary>
    /// Saves changes and automatically updates timestamps.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The number of affected records.</returns>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Updates the CreatedAt and UpdatedAt timestamps for entities.
    /// </summary>
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
