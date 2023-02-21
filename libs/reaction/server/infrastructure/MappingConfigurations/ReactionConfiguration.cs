using OpenSystem.Reaction.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace OpenSystem.Reaction.Infrastructure.MappingConfigurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<ReactionEntity>
    {
        public void Configure(EntityTypeBuilder<ReactionEntity> builder)
        {
          builder.ToTable("Reactions");

          builder.Property(x => x.Id)
            .HasDefaultValueSql("newsequentialid()")
            .IsRequired();

          builder.HasMany(x => x.Details)
            .WithOne(x => x.Reaction)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
