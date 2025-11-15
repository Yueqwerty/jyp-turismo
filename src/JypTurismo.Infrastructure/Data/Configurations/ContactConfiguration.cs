using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using JypTurismo.Core.Entities;

namespace JypTurismo.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for the Contact entity.
/// </summary>
public class ContactConfiguration : IEntityTypeConfiguration<Contact>
{
    /// <summary>
    /// Configures the Contact entity.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public void Configure(EntityTypeBuilder<Contact> builder)
    {
        builder.ToTable("Contacts");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ExternalId)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Channel)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(c => c.DisplayName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.PhoneNumber)
            .HasMaxLength(50);

        builder.Property(c => c.Email)
            .HasMaxLength(255);

        builder.Property(c => c.ProfilePictureUrl)
            .HasMaxLength(1000);

        builder.Property(c => c.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasMany(c => c.Conversations)
            .WithOne(cv => cv.Contact)
            .HasForeignKey(cv => cv.ContactId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => c.ExternalId);
        builder.HasIndex(c => c.Channel);
        builder.HasIndex(c => new { c.ExternalId, c.Channel })
            .IsUnique();
    }
}
