using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using JypTurismo.Core.Entities;

namespace JypTurismo.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Message entity.
/// </summary>
public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    /// <summary>
    /// Configures the Message entity.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("Messages");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.ExternalMessageId)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.Channel)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(m => m.Direction)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(m => m.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(m => m.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(m => m.SenderName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.SenderExternalId)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.RecipientName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.RecipientExternalId)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(m => m.TextContent)
            .HasMaxLength(4000);

        builder.Property(m => m.ErrorMessage)
            .HasMaxLength(1000);

        builder.Property(m => m.SentAt)
            .IsRequired();

        builder.HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(m => m.Attachments)
            .WithOne(a => a.Message)
            .HasForeignKey(a => a.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(m => m.ExternalMessageId);
        builder.HasIndex(m => m.ConversationId);
        builder.HasIndex(m => m.Channel);
        builder.HasIndex(m => m.SentAt);
    }
}
