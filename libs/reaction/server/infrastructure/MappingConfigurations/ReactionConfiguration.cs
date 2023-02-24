using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<ReactionEntity>
    {
        public void Configure(EntityTypeBuilder<ReactionEntity> builder)
        {
          builder.ToTable("Reaction");

          builder.Property(r => r.Id)
            .HasDefaultValueSql("newsequentialid()")
            .IsRequired();

          builder.HasAlternateKey(r => r.ContentId);

          builder.HasMany(r => r.Details)
            .WithOne(d => d.Reaction)
            .HasForeignKey(d => d.ReactionId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
