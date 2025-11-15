using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using JypTurismo.Core.Entities;

namespace JypTurismo.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Attachment entity.
/// </summary>
public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
{
    /// <summary>
    /// Configures the Attachment entity.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Attachment> builder)
    {
        builder.ToTable("Attachments");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(a => a.FileName)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(a => a.MimeType)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(a => a.FileSize)
            .IsRequired();

        builder.Property(a => a.FileUrl)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(a => a.ThumbnailUrl)
            .HasMaxLength(2000);

        builder.Property(a => a.ExternalUrl)
            .HasMaxLength(2000);

        builder.HasOne(a => a.Message)
            .WithMany(m => m.Attachments)
            .HasForeignKey(a => a.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(a => a.MessageId);
    }
}
