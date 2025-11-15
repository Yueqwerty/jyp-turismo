using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using JypTurismo.Core.Entities;

namespace JypTurismo.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Conversation entity.
/// </summary>
public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    /// <summary>
    /// Configures the Conversation entity.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("Conversations");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ExternalConversationId)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Channel)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(c => c.Subject)
            .HasMaxLength(500);

        builder.Property(c => c.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(c => c.UnreadCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.HasOne(c => c.Contact)
            .WithMany(ct => ct.Conversations)
            .HasForeignKey(c => c.ContactId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Messages)
            .WithOne(m => m.Conversation)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => c.ExternalConversationId);
        builder.HasIndex(c => c.ContactId);
        builder.HasIndex(c => c.Channel);
        builder.HasIndex(c => c.LastMessageAt);
    }
}
