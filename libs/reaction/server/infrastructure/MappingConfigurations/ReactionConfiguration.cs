using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenSystem.Core.Domain.Enums;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<ReactionEntity>
    {
        public void Configure(EntityTypeBuilder<ReactionEntity> builder)
        {
          builder.ToTable("Reaction");

          builder.Property(r => r.Id)
            .IsRequired();
          builder.Property(x => x.VerificationCode)
            .HasConversion(
                x => (int)x,
                x => (VerificationCodeTypes)x);

          builder.HasAlternateKey(r => r.ContentId);

          builder.HasMany(r => r.Details)
            .WithOne(d => d.Reaction)
            .HasForeignKey(d => d.ReactionId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
